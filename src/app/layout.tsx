import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@wrksz/themes/next";
import type { Metadata, Viewport } from "next";
import type React from "react";
import {
    SITE_DESCRIPTION,
    SITE_NAME,
    SITE_TITLE,
    SITE_URL,
    THEME_COLOR_DARK,
    THEME_COLOR_LIGHT,
} from "^/lib/site";
import "./globals.css";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: SITE_TITLE,
        template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    applicationName: SITE_NAME,
    keywords: [
        "Star Realms",
        "authority counter",
        "life counter",
        "score tracker",
        "deckbuilding game",
        "board game companion",
        "offline PWA",
    ],
    authors: [{ name: "Oscar Busk", url: "https://github.com/oBusk" }],
    creator: "Oscar Busk",
    alternates: { canonical: "/" },
    // Two-digit scores must not be linkified as phone numbers on iOS.
    formatDetection: { telephone: false },
    icons: {
        icon: [
            { url: "/icons/icon.svg", type: "image/svg+xml" },
            { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
            { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
        apple: { url: "/icons/apple-touch-icon.png", sizes: "180x180" },
    },
    openGraph: {
        type: "website",
        siteName: SITE_NAME,
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        url: "/",
        locale: "en_US",
    },
    twitter: { card: "summary_large_image" },
    appleWebApp: {
        capable: true,
        title: SITE_NAME,
        statusBarStyle: "black-translucent",
    },
    robots: { index: true, follow: true },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    // Let the layout run under the notch; `.safe-area` puts the padding back.
    viewportFit: "cover",
    // Paints the initial canvas dark so a black app has no white flash.
    colorScheme: "dark",
    // `themeColor` is deliberately absent: ThemeProvider owns that meta tag so
    // it can follow the toggle. Declaring it here too would fight it.
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <ThemeProvider
                    attribute="class"
                    themes={["light", "dark"]}
                    // Dark wins regardless of the device preference, by
                    // request: the app is meant to sit on a table all evening.
                    defaultTheme="dark"
                    enableSystem={false}
                    storage="localStorage"
                    storageKey="authority-theme"
                    enableColorScheme
                    disableTransitionOnChange
                    themeColor={{
                        dark: THEME_COLOR_DARK,
                        light: THEME_COLOR_LIGHT,
                    }}
                >
                    {children}
                </ThemeProvider>
                <Analytics />
            </body>
        </html>
    );
}
