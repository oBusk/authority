"use client";

import { useHydrated, useTheme } from "@wrksz/themes/client";
import { LuMoon, LuSun } from "react-icons/lu";
import { CONTROL_BUTTON, CONTROL_ICON } from "^/components/controlStyles";

export function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    // `useTheme` cannot know the stored theme until the client takes over, so
    // render the app's default until then rather than flashing the wrong icon.
    const hydrated = useHydrated();
    const isDark = !hydrated || resolvedTheme !== "light";

    const label = isDark ? "Switch to light mode" : "Switch to dark mode";

    return (
        <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={label}
            title={label}
            className={CONTROL_BUTTON}
        >
            {isDark ? (
                <LuMoon className={CONTROL_ICON} />
            ) : (
                <LuSun className={CONTROL_ICON} />
            )}
        </button>
    );
}
