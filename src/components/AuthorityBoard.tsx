"use client";

import { useEffect, useState } from "react";
import { Header } from "^/components/Header";
import { InlineScript } from "^/components/InlineScript";
import { PlayerCounter } from "^/components/PlayerCounter";
import {
    adjustAuthority,
    appliedChange,
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
        // Tally what the tap actually does, not what was asked for: at 0 a
        // `-` tap is a no-op, and showing "-3" for three taps that changed
        // nothing would be a lie. Derived from the committed state rather
        // than inside the updater, which has to stay pure.
        const applied = appliedChange(game, player, amount);

        // The total moves in the same render as the tap.
        setGame((current) => adjustAuthority(current, player, amount));

        if (applied !== 0) {
            deltas[player].add(applied);
        }
    }

    function startNewGame() {
        setGame(newGame());
        p1Delta.reset();
        p2Delta.reset();
    }

    return (
        <div className="flex h-dvh flex-col overflow-hidden safe-area">
            <Header onNewGame={startNewGame} />
            {/* min-h-0 lets the counters shrink inside the flex column. */}
            <main className="grid min-h-0 flex-1 grid-cols-2 divide-x">
                <PlayerCounter
                    player="p1"
                    authority={game.p1}
                    delta={p1Delta}
                    onAdjust={(amount) => adjust("p1", amount)}
                />
                <PlayerCounter
                    player="p2"
                    authority={game.p2}
                    delta={p2Delta}
                    onAdjust={(amount) => adjust("p2", amount)}
                />
            </main>
            {/* Must come after the counters it patches. */}
            <InlineScript html={RESTORE_SCRIPT} />
        </div>
    );
}
