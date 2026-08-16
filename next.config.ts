import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactCompiler: true,
    cacheComponents: true,
    experimental: {
        // Tailwind is atomic and this app is a single small screen, so
        // inlining the stylesheet removes a render-blocking round trip on
        // first load. Repeat visits are served by the service worker anyway.
        inlineCss: true,
    },
    headers: () => [
        {
            source: "/sw.js",
            headers: [
                {
                    key: "Content-Type",
                    value: "application/javascript; charset=utf-8",
                },
                {
                    // Never let a stale worker pin an old build.
                    key: "Cache-Control",
                    value: "no-cache, no-store, must-revalidate",
                },
            ],
        },
    ],
};

export default nextConfig;
