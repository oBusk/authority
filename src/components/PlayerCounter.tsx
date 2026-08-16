"use client";

import {
    authorityElementId,
    PLAYER_LABELS,
    type PlayerId,
} from "^/lib/authority";
import { cx } from "^/lib/cva";
import type { Delta } from "^/lib/useDelta";

const ADJUST_BUTTON = cx(
    "flex items-center justify-center rounded-2xl border",
    "bg-secondary text-secondary-foreground",
    "size-[clamp(3.5rem,18vmin,7rem)] text-[clamp(1.75rem,8vmin,3.5rem)]",
    "leading-none font-light",
    "transition-colors active:bg-accent",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden",
);

export interface PlayerCounterProps {
    player: PlayerId;
    authority: number;
    delta: Delta;
    onAdjust: (amount: number) => void;
}

export function PlayerCounter({
    player,
    authority,
    delta,
    onAdjust,
}: PlayerCounterProps) {
    const label = PLAYER_LABELS[player];

    return (
        <section
            aria-label={label}
            className="flex flex-col items-center justify-center gap-[3vmin] p-[2vmin]"
        >
            {/*
             * Always occupies its line box so the authority number below never
             * shifts as the chip appears and fades.
             */}
            <span
                aria-hidden="true"
                className={cx(
                    "text-muted-foreground tabular-nums",
                    "text-[clamp(1rem,5vmin,2rem)] leading-none font-medium",
                    // Appears instantly with the tap, then fades out slowly.
                    "transition-opacity",
                    delta.value === 0
                        ? "opacity-0 duration-500"
                        : "opacity-100 duration-0",
                )}
            >
                {delta.label === "" ? " " : delta.label}
            </span>

            {/*
             * `output` carries an implicit `role="status"`, so screen readers
             * announce the new total politely without a separate live region.
             * The id and `suppressHydrationWarning` let the pre-hydration
             * restore script rewrite this text before React hydrates.
             */}
            <output
                id={authorityElementId(player)}
                suppressHydrationWarning
                className="text-[clamp(4rem,26vmin,12rem)] leading-none font-bold tabular-nums"
            >
                {authority}
            </output>

            <div className="flex gap-[4vmin]">
                <button
                    type="button"
                    onClick={() => onAdjust(-1)}
                    aria-label={`${label}: lose 1 authority`}
                    className={ADJUST_BUTTON}
                >
                    &minus;
                </button>
                <button
                    type="button"
                    onClick={() => onAdjust(1)}
                    aria-label={`${label}: gain 1 authority`}
                    className={ADJUST_BUTTON}
                >
                    +
                </button>
            </div>
        </section>
    );
}
