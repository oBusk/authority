"use client";

import { useTheme } from "@wrksz/themes/client";
import { useEffect, useState } from "react";
import { LuMonitor, LuMoon, LuSun } from "react-icons/lu";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="fixed top-4 right-4 size-[52px] rounded-full border border-zinc-200 bg-white/80 p-3 shadow-lg backdrop-blur-xs dark:border-zinc-700 dark:bg-zinc-800/80" />
        );
    }

    const toggleTheme = () => {
        if (theme === "light") {
            setTheme("dark");
        } else if (theme === "dark") {
            setTheme("system");
        } else {
            setTheme("light");
        }
    };

    const getIcon = () => {
        if (theme === "light") {
            return <LuSun className="size-5" />;
        } else if (theme === "dark") {
            return <LuMoon className="size-5" />;
        } else {
            return <LuMonitor className="size-5" />;
        }
    };

    const getLabel = () => {
        if (theme === "light") return "Switch to dark mode";
        if (theme === "dark") return "Switch to system theme";
        return "Switch to light mode";
    };

    return (
        <button
            onClick={toggleTheme}
            className="fixed top-4 right-4 rounded-full border border-zinc-200 bg-white/80 p-3 shadow-lg backdrop-blur-xs transition-all duration-200 hover:bg-white hover:shadow-xl dark:border-zinc-700 dark:bg-zinc-800/80 dark:hover:bg-zinc-800"
            aria-label={getLabel()}
            title={getLabel()}
        >
            {getIcon()}
        </button>
    );
}
