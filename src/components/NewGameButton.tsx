"use client";

import { useRef } from "react";
import { LuRotateCcw } from "react-icons/lu";
import { Button } from "^/components/Button";
import { CONTROL_BUTTON, CONTROL_ICON } from "^/components/controlStyles";
import { STARTING_AUTHORITY } from "^/lib/authority";

export function NewGameButton({ onConfirm }: { onConfirm: () => void }) {
    const dialog = useRef<HTMLDialogElement>(null);

    return (
        <>
            <button
                type="button"
                onClick={() => dialog.current?.showModal()}
                aria-label="Start a new game"
                title="Start a new game"
                className={CONTROL_BUTTON}
            >
                <LuRotateCcw className={CONTROL_ICON} />
            </button>

            {/*
             * A native modal dialog gives us the focus trap, Esc-to-close and
             * inert background for free. It also makes the confirmation
             * unmissable, which is the point: a mis-tap here ends the game.
             */}
            <dialog
                ref={dialog}
                aria-labelledby="new-game-title"
                className="m-auto max-w-xs rounded-2xl border bg-background p-6 text-foreground shadow-xl backdrop:bg-black/70"
            >
                <h2 id="new-game-title" className="text-lg font-semibold">
                    Start a new game?
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    Both players go back to {STARTING_AUTHORITY} authority. The
                    current game is lost.
                </p>
                <form method="dialog" className="mt-6 flex justify-end gap-2">
                    <Button variant="outline" value="cancel">
                        Cancel
                    </Button>
                    <Button value="confirm" onClick={onConfirm}>
                        New game
                    </Button>
                </form>
            </dialog>
        </>
    );
}
