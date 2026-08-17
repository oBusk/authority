import {
    adjustAuthority,
    appliedChange,
    clampAuthority,
    formatDelta,
    newGame,
    STARTING_AUTHORITY,
} from "^/lib/authority";

describe("newGame", () => {
    it("starts both players on 50", () => {
        expect(newGame()).toEqual({ p1: 50, p2: 50 });
        expect(STARTING_AUTHORITY).toBe(50);
    });

    it("returns a fresh object each time", () => {
        expect(newGame()).not.toBe(newGame());
    });
});

describe("clampAuthority", () => {
    it("floors at zero", () => {
        expect(clampAuthority(-1)).toBe(0);
        expect(clampAuthority(-50)).toBe(0);
    });

    it("has no upper bound", () => {
        expect(clampAuthority(999)).toBe(999);
    });

    it("truncates fractions", () => {
        expect(clampAuthority(12.9)).toBe(12);
    });
});

describe("adjustAuthority", () => {
    it("applies a positive amount to one player only", () => {
        expect(adjustAuthority(newGame(), "p1", 7)).toEqual({
            p1: 57,
            p2: 50,
        });
    });

    it("applies a negative amount", () => {
        expect(adjustAuthority(newGame(), "p2", -3)).toEqual({
            p1: 50,
            p2: 47,
        });
    });

    it("stops at zero instead of going negative", () => {
        expect(adjustAuthority({ p1: 2, p2: 50 }, "p1", -5)).toEqual({
            p1: 0,
            p2: 50,
        });
    });

    it("does not mutate the previous state", () => {
        const before = newGame();
        adjustAuthority(before, "p1", 5);
        expect(before).toEqual({ p1: 50, p2: 50 });
    });
});

describe("appliedChange", () => {
    it("is the full amount when nothing is clamped", () => {
        expect(appliedChange(newGame(), "p1", 7)).toBe(7);
        expect(appliedChange(newGame(), "p1", -7)).toBe(-7);
    });

    it("is zero for a player already on zero", () => {
        expect(appliedChange({ p1: 0, p2: 50 }, "p1", -1)).toBe(0);
        expect(appliedChange({ p1: 0, p2: 50 }, "p1", -10)).toBe(0);
    });

    it("is only the part that fits when the floor is hit", () => {
        expect(appliedChange({ p1: 2, p2: 50 }, "p1", -5)).toBe(-2);
    });

    it("still applies gains from zero", () => {
        expect(appliedChange({ p1: 0, p2: 50 }, "p1", 3)).toBe(3);
    });
});

describe("formatDelta", () => {
    it("signs positive runs", () => {
        expect(formatDelta(7)).toBe("+7");
    });

    it("keeps the native minus sign for negative runs", () => {
        expect(formatDelta(-3)).toBe("-3");
    });
});
