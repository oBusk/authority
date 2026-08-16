"use client";

import Link from "next/link";
import { LuInfo } from "react-icons/lu";
import { SiGithub } from "react-icons/si";
import { CONTROL_BUTTON, CONTROL_ICON } from "^/components/controlStyles";
import { NewGameButton } from "^/components/NewGameButton";
import { ThemeToggle } from "^/components/ThemeToggle";
import { REPOSITORY_URL } from "^/lib/site";

/**
 * Deliberately narrow and low-contrast: the counters are the app, and this
 * strip doubles as the divider between the two players.
 */
export function ControlStrip({ onNewGame }: { onNewGame: () => void }) {
    return (
        <nav
            aria-label="Game controls"
            className="flex flex-col items-center justify-center gap-[2vmin] border-x px-[1vmin]"
        >
            <NewGameButton onConfirm={onNewGame} />
            <ThemeToggle />
            <Link
                href="/about"
                aria-label="About Authority"
                title="About Authority"
                className={CONTROL_BUTTON}
            >
                <LuInfo className={CONTROL_ICON} />
            </Link>
            <a
                href={REPOSITORY_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Authority on GitHub"
                title="Authority on GitHub"
                className={CONTROL_BUTTON}
            >
                <SiGithub className={CONTROL_ICON} />
            </a>
        </nav>
    );
}
