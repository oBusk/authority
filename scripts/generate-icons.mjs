/**
 * One-off asset generator. Rasterises `public/icons/icon.svg` into the PNG
 * set the web app manifest and iOS need, and renders the Open Graph card.
 *
 * The output is committed, so this only needs re-running when the mark or the
 * tagline changes:
 *
 *     node scripts/generate-icons.mjs
 *
 * `sharp` is not a direct dependency — it arrives underneath `next` — so it is
 * resolved from the pnpm store rather than imported by name.
 */
import { readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ICONS = join(ROOT, "public", "icons");
const APP = join(ROOT, "src", "app");

const BLACK = { r: 0, g: 0, b: 0, alpha: 1 };

/**
 * Resolves sharp, which pnpm's isolated layout hides from the project root.
 * @returns {(input?: unknown, options?: object) => object} The sharp factory.
 */
function loadSharp() {
    try {
        return require("sharp");
    } catch {
        // pnpm's isolated layout keeps transitive deps out of the root.
        const store = join(ROOT, "node_modules", ".pnpm");
        const match = readdirSync(store).find((entry) =>
            entry.startsWith("sharp@"),
        );
        if (!match) {
            throw new Error(
                "sharp not found. Run `pnpm install` first, or " +
                    "`pnpm add -D sharp` to generate icons.",
            );
        }
        return require(join(store, match, "node_modules", "sharp"));
    }
}

const sharp = loadSharp();
const source = readFileSync(join(ICONS, "icon.svg"));

/**
 * Renders the mark at its own size, corners and all.
 * @param {number} size - Output width and height in pixels.
 * @returns {object} A sharp pipeline producing the PNG.
 */
function render(size) {
    return sharp(source, { density: 512 }).resize(size, size).png();
}

/**
 * Renders the mark inset on an opaque square. Used where the platform applies
 * its own mask: Android maskable icons only guarantee the middle 80%, and iOS
 * rounds the corners itself.
 * @param {number} size - Output width and height in pixels.
 * @param {number} scale - Fraction of the canvas the mark should occupy.
 * @returns {Promise<object>} A sharp pipeline producing the PNG.
 */
async function renderInset(size, scale) {
    const inner = Math.round(size * scale);
    const mark = await sharp(source, { density: 512 })
        .resize(inner, inner)
        .png()
        .toBuffer();

    return sharp({
        create: {
            width: size,
            height: size,
            channels: 4,
            background: BLACK,
        },
    })
        .composite([{ input: mark, gravity: "centre" }])
        .png();
}

/**
 * Builds the Open Graph card. Text is baked into the committed PNG, so no
 * font needs to be present at build or run time.
 * @returns {Buffer} The SVG source for the card.
 */
function openGraphSvg() {
    // Liberation Sans is metric-compatible with Arial and is what the
    // committed PNG was rendered with; nothing at build or run time needs it.
    const font = "Liberation Sans, DejaVu Sans, sans-serif";

    return Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <rect width="1200" height="630" fill="#000000"/>
    <g transform="translate(96, 155) scale(0.625)">
        <defs>
            <linearGradient id="shield" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#7dd3fc"/>
                <stop offset="100%" stop-color="#2563eb"/>
            </linearGradient>
        </defs>
        <path
            d="M256 48 84 116v148c0 106 74 174 172 200 98-26 172-94 172-200V116L256 48Z"
            fill="url(#shield)"/>
        <path fill-rule="evenodd" fill="#000000"
            d="M256 140 350 356h-52l-18-44h-48l-18 44h-52L256 140Zm0 78-30 74h60l-30-74Z"/>
    </g>
    <text x="440" y="285" font-family="${font}" font-size="104"
        font-weight="bold" fill="#ffffff">Authority</text>
    <text x="440" y="355" font-family="${font}" font-size="42"
        fill="#a1a1aa">A life counter for Star Realms</text>
    <text x="440" y="430" font-family="${font}" font-size="32"
        fill="#2563eb">authority.nulldozzer.io</text>
</svg>`);
}

const outputs = [
    [join(ICONS, "icon-192.png"), render(192)],
    [join(ICONS, "icon-512.png"), render(512)],
    [join(ICONS, "icon-maskable-512.png"), await renderInset(512, 0.7)],
    [join(ICONS, "apple-touch-icon.png"), await renderInset(180, 0.88)],
    [
        join(APP, "opengraph-image.png"),
        // Rendered at 2x and downsampled, so the text stays crisp at the
        // 1200x630 every social card scraper expects.
        sharp(openGraphSvg(), { density: 144 }).resize(1200, 630).png(),
    ],
];

for (const [path, image] of outputs) {
    await image.toFile(path);
    console.log(`wrote ${path.replace(`${ROOT}/`, "")}`);
}
