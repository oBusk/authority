import type { MetadataRoute } from "next";
import { SITE_URL } from "^/lib/site";

/**
 * A literal, not `new Date()`. Cache Components treats synchronous IO during
 * prerender — including reading the clock — as a build error, and a sitemap
 * that changes on every build is noise to crawlers anyway. Bump it when the
 * page content meaningfully changes.
 */
const LAST_MODIFIED = "2026-08-16";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: SITE_URL,
            lastModified: LAST_MODIFIED,
            changeFrequency: "monthly",
            priority: 1,
        },
        {
            url: `${SITE_URL}/about`,
            lastModified: LAST_MODIFIED,
            changeFrequency: "monthly",
            priority: 0.5,
        },
    ];
}
