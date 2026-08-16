import {
    authorityElementId,
    clampAuthority,
    type GameState,
    newGame,
    PLAYER_IDS,
} from "^/lib/authority";

/**
 * Versioned so a future change to the shape can never be read as a valid
 * game. Bump the suffix instead of migrating.
 */
export const STORAGE_KEY = "authority:v1";

/**
 * Parses a stored game, falling back to a fresh one for anything malformed.
 * Never throws: a corrupt value must not stop the app from starting.
 */
export function parseGame(raw: string | null): GameState {
    if (raw == null) {
        return newGame();
    }

    let parsed: unknown;
    try {
        parsed = JSON.parse(raw);
    } catch {
        return newGame();
    }

    if (typeof parsed !== "object" || parsed == null) {
        return newGame();
    }

    const candidate = parsed as Partial<Record<string, unknown>>;
    const state = newGame();

    for (const player of PLAYER_IDS) {
        const value = candidate[player];
        if (typeof value !== "number" || !Number.isFinite(value)) {
            return newGame();
        }
        state[player] = clampAuthority(value);
    }

    return state;
}

export function readGame(): GameState {
    if (typeof window === "undefined") {
        return newGame();
    }

    try {
        return parseGame(window.localStorage.getItem(STORAGE_KEY));
    } catch {
        // Private browsing modes can throw on access rather than return null.
        return newGame();
    }
}

export function writeGame(state: GameState): void {
    if (typeof window === "undefined") {
        return;
    }

    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
        // Storage full or blocked: the in-memory game still works.
    }
}

/**
 * Source for the inline script that rewrites the authority numbers straight
 * into the DOM while the browser is still parsing the HTML, so a restored
 * game never flashes the prerendered 50/50 first.
 *
 * Kept in this file so it cannot drift from {@link STORAGE_KEY}.
 */
export function restoreScriptSource(): string {
    const targets = PLAYER_IDS.map((player) => [
        player,
        authorityElementId(player),
    ]);

    return [
        "(function(){try{",
        `var raw=localStorage.getItem(${JSON.stringify(STORAGE_KEY)});`,
        "if(!raw)return;",
        "var game=JSON.parse(raw);",
        `${JSON.stringify(targets)}.forEach(function(target){`,
        "var value=game[target[0]];",
        'if(typeof value!=="number"||!isFinite(value))return;',
        "var el=document.getElementById(target[1]);",
        "if(el)el.textContent=String(Math.max(0,Math.trunc(value)));",
        "});",
        "}catch(e){}})()",
    ].join("");
}
