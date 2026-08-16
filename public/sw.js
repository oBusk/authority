/**
 * Offline support for Authority. Hand-written on purpose: the whole app is two
 * documents and one bundle, so a build-time precache manifest would be more
 * machinery than the problem deserves — and it would not survive Vercel's
 * skew-protected asset URLs anyway.
 *
 * Bump VERSION whenever this file changes; `activate` drops every cache that
 * does not match, which is also the escape hatch if a cache goes bad.
 */
const VERSION = "v1";
const SHELL = `authority-shell-${VERSION}`;
const ASSETS = `authority-assets-${VERSION}`;

/** Only path-stable URLs. Hashed bundles are handled at runtime instead. */
const PRECACHE = [
    "/",
    "/about",
    "/manifest.webmanifest",
    "/icons/icon.svg",
    "/icons/icon-192.png",
    "/icons/icon-512.png",
];

/** Keeps the asset cache from growing without bound across deploys. */
const MAX_ASSETS = 120;

self.addEventListener("install", (event) => {
    event.waitUntil(
        (async () => {
            const cache = await self.caches.open(SHELL);
            // allSettled: one 404 must not abort the whole install.
            await Promise.allSettled(
                PRECACHE.map((url) =>
                    cache.add(new Request(url, { cache: "reload" })),
                ),
            );
            await self.skipWaiting();
        })(),
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        (async () => {
            const keys = await self.caches.keys();
            await Promise.all(
                keys
                    .filter((key) => key !== SHELL && key !== ASSETS)
                    .map((key) => self.caches.delete(key)),
            );
            // Take control on the first load, so the page can hand us the
            // asset list it already fetched (see the message handler).
            await self.clients.claim();
        })(),
    );
});

/**
 * React Server Component payloads and router prefetches. Serving a cached
 * document in place of one of these breaks the router, and letting them fail
 * offline is harmless: the router falls back to a real navigation, which we
 * do serve from cache.
 * @param {Request} request - The intercepted request.
 * @param {URL} url - The parsed request URL.
 * @returns {boolean} True when the request belongs to the router.
 */
function isRouterTraffic(request, url) {
    return (
        request.headers.get("RSC") === "1" ||
        request.headers.has("Next-Router-Prefetch") ||
        url.searchParams.has("_rsc") ||
        url.pathname.endsWith(".rsc") ||
        url.pathname.includes(".segments/")
    );
}

/**
 * Serves immutable, content-hashed assets without ever hitting the network
 * twice for the same URL.
 * @param {Request} request - The intercepted request.
 * @param {string} cacheName - Cache to read from and populate.
 * @returns {Promise<Response>} The cached or freshly fetched response.
 */
async function cacheFirst(request, cacheName) {
    const cache = await self.caches.open(cacheName);
    const cached = await cache.match(request);
    if (cached) {
        return cached;
    }

    const response = await fetch(request);
    if (response.ok) {
        await cache.put(request, response.clone());
    }
    return response;
}

/**
 * Answer from cache immediately and refresh in the background. Chosen over
 * network-first so a flaky café connection cannot leave the counter hanging
 * on a TCP timeout — the newer document is simply picked up next load.
 * @param {FetchEvent} event - The fetch event being answered.
 * @param {string} cacheName - Cache to read from and populate.
 * @param {string|null} fallbackPath - Cached path to fall back to offline.
 * @returns {Promise<Response>} The cached, fetched or fallback response.
 */
async function staleWhileRevalidate(event, cacheName, fallbackPath) {
    const request = event.request;
    const cache = await self.caches.open(cacheName);
    const cached = await cache.match(request, { ignoreSearch: true });

    const network = fetch(request)
        .then((response) => {
            if (response.ok) {
                void cache.put(request, response.clone());
            }
            return response;
        })
        .catch(() => null);

    if (cached) {
        event.waitUntil(network);
        return cached;
    }

    const response = await network;
    if (response) {
        return response;
    }
    if (fallbackPath) {
        const fallback = await cache.match(fallbackPath);
        if (fallback) {
            return fallback;
        }
    }
    return Response.error();
}

self.addEventListener("fetch", (event) => {
    const request = event.request;
    if (request.method !== "GET") {
        return;
    }

    const url = new URL(request.url);
    if (url.origin !== self.location.origin || isRouterTraffic(request, url)) {
        return;
    }

    if (request.mode === "navigate") {
        event.respondWith(staleWhileRevalidate(event, SHELL, "/"));
        return;
    }

    // Content-hashed and served immutable, so the cached copy is always right.
    if (url.pathname.startsWith("/_next/static/")) {
        event.respondWith(cacheFirst(request, ASSETS));
        return;
    }

    if (
        url.pathname.startsWith("/icons/") ||
        url.pathname === "/manifest.webmanifest"
    ) {
        event.respondWith(staleWhileRevalidate(event, SHELL, null));
    }
});

/**
 * The page posts the URLs it has already loaded once the worker is in control.
 * Those requests happened before this worker existed, so the fetch handler
 * never saw them — without this, a cold offline load only works from the
 * second visit onwards.
 */
self.addEventListener("message", (event) => {
    const data = event.data;
    if (!data || data.type !== "CACHE_ASSETS" || !Array.isArray(data.urls)) {
        return;
    }

    event.waitUntil(
        (async () => {
            const cache = await self.caches.open(ASSETS);
            const wanted = data.urls.filter((candidate) => {
                try {
                    const url = new URL(candidate);
                    return (
                        url.origin === self.location.origin &&
                        url.pathname.startsWith("/_next/static/")
                    );
                } catch {
                    return false;
                }
            });

            await Promise.allSettled(
                wanted.map(async (url) => {
                    if (await cache.match(url)) {
                        return;
                    }
                    await cache.add(new Request(url, { cache: "no-cache" }));
                }),
            );

            // Cache keys come back in insertion order, so the oldest go first.
            const keys = await cache.keys();
            const excess = keys.length - MAX_ASSETS;
            for (let i = 0; i < excess; i++) {
                await cache.delete(keys[i]);
            }
        })(),
    );
});
