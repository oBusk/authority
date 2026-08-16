"use client";

import { useEffect } from "react";

/**
 * Keeps the screen awake while the app is in the foreground, on devices that
 * support the Screen Wake Lock API. There is no toggle by design: a counter
 * sitting on the table is useless if the phone dims mid-game.
 *
 * The browser releases the sentinel whenever the page is hidden, so the lock
 * has to be re-acquired every time the app becomes visible again.
 */
export function useWakeLock(): void {
    useEffect(() => {
        // Typed as always-present by lib.dom, but Safari and older Android
        // really do lack it.
        if (!("wakeLock" in navigator)) {
            return;
        }

        let sentinel: WakeLockSentinel | null = null;
        let released = false;

        const acquire = async () => {
            if (released || document.visibilityState !== "visible") {
                return;
            }

            try {
                sentinel = await navigator.wakeLock.request("screen");
            } catch {
                // NotAllowedError: battery saver, or the page lost visibility
                // while the request was in flight. Nothing to do but carry on.
            }

            if (released) {
                void sentinel?.release();
            }
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                void acquire();
            }
        };

        void acquire();
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            released = true;
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange,
            );
            void sentinel?.release();
        };
    }, []);
}
