import type { MetadataRoute } from "next";
import {
    SITE_DESCRIPTION,
    SITE_NAME,
    SITE_TITLE,
    THEME_COLOR_DARK,
} from "^/lib/site";

export default function manifest(): MetadataRoute.Manifest {
    return {
        id: "/",
        name: SITE_TITLE,
        short_name: SITE_NAME,
        description: SITE_DESCRIPTION,
        start_url: "/",
        scope: "/",
        display: "standalone",
        // The layout works either way up, so let the device decide rather
        // than locking someone into a sideways UI.
        orientation: "any",
        background_color: THEME_COLOR_DARK,
        theme_color: THEME_COLOR_DARK,
        categories: ["games", "utilities"],
        icons: [
            {
                src: "/icons/icon-192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "any",
            },
            {
                src: "/icons/icon-512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "any",
            },
            {
                src: "/icons/icon-maskable-512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable",
            },
        ],
    };
}
