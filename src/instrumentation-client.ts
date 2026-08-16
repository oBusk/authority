/**
 * Registers the offline service worker.
 *
 * This file runs after the HTML document loads but before React hydrates, so
 * the actual work is deferred to `load` to keep it off the critical path.
 * Offline support is a progressive enhancement — every failure here is
 * swallowed, because none of it should ever stop the counter from working.
 */

/**
 * Hands the worker the assets this page already fetched. They were requested
 * before the worker took control, so its fetch handler never saw them.
 */
function sendLoadedAssets() {
    const controller = navigator.serviceWorker.controller;
    if (!controller) {
        return;
    }

    controller.postMessage({
        type: "CACHE_ASSETS",
        urls: performance
            .getEntriesByType("resource")
            .map((entry) => entry.name),
    });
}

if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/sw.js", { scope: "/", updateViaCache: "none" })
            .then(sendLoadedAssets)
            .catch(() => {
                // No offline support in this browser or context. Fine.
            });
    });

    // On a first visit the worker only takes control once it activates, which
    // is usually after the register() promise has already resolved.
    navigator.serviceWorker.addEventListener(
        "controllerchange",
        sendLoadedAssets,
    );
}
