"use client";

import { useEffect, useState } from "react";
import { ControlStrip } from "^/components/ControlStrip";
import { InlineScript } from "^/components/InlineScript";
import { PlayerCounter } from "^/components/PlayerCounter";
import {
    adjustAuthority,
    type GameState,
    newGame,
    type PlayerId,
} from "^/lib/authority";
import { readGame, restoreScriptSource, writeGame } from "^/lib/storage";
import { type Delta, useDelta } from "^/lib/useDelta";
import { useWakeLock } from "^/lib/useWakeLock";

// Module scope: the script text is a constant, so nothing re-derives it.
const RESTORE_SCRIPT = restoreScriptSource();

export function AuthorityBoard() {
    // Lazy initializer, reading the same key as RESTORE_SCRIPT so React's
    // first client render already matches the DOM that script patched.
    const [game, setGame] = useState<GameState>(readGame);

    // One per player; deltas are transient and never persisted.
    const p1Delta = useDelta();
    const p2Delta = useDelta();
    const deltas: Record<PlayerId, Delta> = { p1: p1Delta, p2: p2Delta };

    useWakeLock();

    useEffect(() => {
        writeGame(game);
    }, [game]);

    function adjust(player: PlayerId, amount: number) {
        // The total moves in the same render as the tap; the chip is only a
        // running tally of how many times the button has been pressed.
        setGame((current) => adjustAuthority(current, player, amount));
        deltas[player].add(amount);
    }

    function startNewGame() {
        setGame(newGame());
        p1Delta.reset();
        p2Delta.reset();
    }

    return (
        <main className="grid h-dvh grid-cols-[1fr_auto_1fr] overflow-hidden safe-area">
            <PlayerCounter
                player="p1"
                authority={game.p1}
                delta={p1Delta}
                onAdjust={(amount) => adjust("p1", amount)}
            />
            <ControlStrip onNewGame={startNewGame} />
            <PlayerCounter
                player="p2"
                authority={game.p2}
                delta={p2Delta}
                onAdjust={(amount) => adjust("p2", amount)}
            />
            {/* Must come after the counters it patches. */}
            <InlineScript html={RESTORE_SCRIPT} />
        </main>
    );
}
