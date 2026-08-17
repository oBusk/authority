"use client";

import Link from "next/link";
import { LuInfo } from "react-icons/lu";
import { SiGithub } from "react-icons/si";
import { CONTROL_BUTTON, CONTROL_ICON } from "^/components/controlStyles";
import { Logo } from "^/components/Logo";
import { NewGameButton } from "^/components/NewGameButton";
import { ThemeToggle } from "^/components/ThemeToggle";
import { REPOSITORY_URL, SITE_NAME, SITE_TAGLINE } from "^/lib/site";

/**
 * Branding on the left, controls on the right, in one slim bar above the
 * counters. Sized in `vmin` with rem floors so it stays a thin strip in
 * landscape — the counters are what the screen is for.
 *
 * The `h1` and tagline are the only crawlable copy on `/`; everything longer
 * lives on `/about`.
 */
export function Header({ onNewGame }: { onNewGame: () => void }) {
    return (
        <header className="flex shrink-0 items-center justify-between gap-3 border-b px-[max(0.75rem,2vmin)] py-[max(0.375rem,1vmin)]">
            <div className="flex min-w-0 items-baseline gap-[max(0.5rem,1.2vmin)]">
                <Logo className="size-[max(1.1rem,3vmin)] shrink-0 self-center" />
                <h1 className="text-[max(0.95rem,2.4vmin)] leading-none font-semibold tracking-tight">
                    {SITE_NAME}
                </h1>
                <p className="hidden truncate text-[max(0.75rem,1.7vmin)] leading-none text-muted-foreground sm:block">
                    {SITE_TAGLINE}
                </p>
            </div>

            <nav
                aria-label="Game controls"
                className="flex shrink-0 items-center gap-[max(0.125rem,0.5vmin)]"
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
        </header>
    );
}
