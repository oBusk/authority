/**
 * Pure game rules for a two player game of Star Realms.
 *
 * Deliberately free of React and of `window` so it can be unit tested and
 * reused by the pre-hydration restore script.
 */

/** Both players start a game of Star Realms on 50 authority. */
export const STARTING_AUTHORITY = 50;

/** You are out at 0; authority never goes negative. */
export const MIN_AUTHORITY = 0;

export const PLAYER_IDS = ["p1", "p2"] as const;

export type PlayerId = (typeof PLAYER_IDS)[number];

export type GameState = Record<PlayerId, number>;

export const PLAYER_LABELS: Record<PlayerId, string> = {
    p1: "Player 1",
    p2: "Player 2",
};

/** DOM id of a player's authority number, shared with the restore script. */
export function authorityElementId(player: PlayerId): string {
    return `authority-${player}`;
}

export function newGame(): GameState {
    return { p1: STARTING_AUTHORITY, p2: STARTING_AUTHORITY };
}

export function clampAuthority(value: number): number {
    return Math.max(MIN_AUTHORITY, Math.trunc(value));
}

export function adjustAuthority(
    state: GameState,
    player: PlayerId,
    amount: number,
): GameState {
    return { ...state, [player]: clampAuthority(state[player] + amount) };
}

/** Formats an accumulated run of clicks, e.g. `+7` or `-3`. */
export function formatDelta(delta: number): string {
    return delta > 0 ? `+${delta}` : `${delta}`;
}
