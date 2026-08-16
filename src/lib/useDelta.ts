"use client";

import { useCallback, useEffect, useState } from "react";
import { formatDelta } from "^/lib/authority";

/** How long the running total stays on screen after the last tap. */
export const DELTA_TIMEOUT_MS = 2000;

export interface Delta {
    /** Net change since the run of taps started; `0` means nothing to show. */
    value: number;
    /**
     * Rendered label. Retained after {@link value} returns to `0` so the chip
     * can fade out with its text intact rather than blanking mid-animation.
     */
    label: string;
    add: (amount: number) => void;
    reset: () => void;
}

interface DeltaState {
    value: number;
    label: string;
}

const EMPTY: DeltaState = { value: 0, label: "" };

/**
 * Accumulates a run of `+`/`-` taps so tapping `+` seven times reads `+7`,
 * and clears it once the player stops tapping for {@link DELTA_TIMEOUT_MS}.
 *
 * The authority total itself is updated by the caller on every tap, so it is
 * always instant — this only drives the transient chip.
 */
export function useDelta(timeoutMs: number = DELTA_TIMEOUT_MS): Delta {
    const [state, setState] = useState<DeltaState>(EMPTY);

    // Re-runs whenever the running total changes, so each tap restarts the
    // idle window rather than letting the first tap's deadline stand.
    useEffect(() => {
        if (state.value === 0) {
            return;
        }

        const timer = setTimeout(
            () => setState((current) => ({ ...current, value: 0 })),
            timeoutMs,
        );
        return () => clearTimeout(timer);
    }, [state.value, timeoutMs]);

    const add = useCallback((amount: number) => {
        setState((current) => {
            const value = current.value + amount;
            return {
                value,
                label: value === 0 ? current.label : formatDelta(value),
            };
        });
    }, []);

    const reset = useCallback(() => setState(EMPTY), []);

    return { value: state.value, label: state.label, add, reset };
}
