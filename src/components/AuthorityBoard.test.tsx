import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { AuthorityBoard } from "^/components/AuthorityBoard";
import { STORAGE_KEY } from "^/lib/storage";

/*
 * `@wrksz/themes` is ESM-only, which Jest's CJS runtime cannot require. The
 * theme toggle is incidental to this board, so stub the hooks rather than
 * reworking the transform config. Real theming is covered end to end.
 */
jest.mock(
    "@wrksz/themes/client",
    () => ({
        useTheme: () => ({ resolvedTheme: "dark", setTheme: jest.fn() }),
        useHydrated: () => true,
    }),
    { virtual: true },
);

/** jsdom implements neither of the dialog methods. */
beforeAll(() => {
    HTMLDialogElement.prototype.showModal = function showModal() {
        this.open = true;
    };
    HTMLDialogElement.prototype.close = function close() {
        this.open = false;
    };
});

beforeEach(() => {
    window.localStorage.clear();
});

/** The authority total, which is an `output` and so has role `status`. */
function counter(player: "Player 1" | "Player 2") {
    return within(screen.getByRole("region", { name: player })).getByRole(
        "status",
    );
}

function tap(name: string, times = 1) {
    const button = screen.getByRole("button", { name });
    for (let i = 0; i < times; i++) {
        fireEvent.click(button);
    }
}

describe("AuthorityBoard", () => {
    it("starts a fresh game on 50 each", () => {
        render(<AuthorityBoard />);

        expect(counter("Player 1")).toHaveTextContent("50");
        expect(counter("Player 2")).toHaveTextContent("50");
    });

    it("restores a stored game", () => {
        window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ p1: 43, p2: 12 }),
        );

        render(<AuthorityBoard />);

        expect(counter("Player 1")).toHaveTextContent("43");
        expect(counter("Player 2")).toHaveTextContent("12");
    });

    it("adds one per tap and shows the running total", () => {
        render(<AuthorityBoard />);

        tap("Player 1: gain 1 authority", 7);

        expect(counter("Player 1")).toHaveTextContent("57");
        // The chip is aria-hidden, so it is not reachable by role.
        expect(screen.getByText("+7")).toBeInTheDocument();
        // Taps must not leak across players.
        expect(counter("Player 2")).toHaveTextContent("50");
    });

    it("keeps the total once the running tally stops", () => {
        jest.useFakeTimers();
        render(<AuthorityBoard />);

        tap("Player 1: lose 1 authority");
        expect(screen.getByText("-1")).toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(2000);
        });

        expect(counter("Player 1")).toHaveTextContent("49");
        jest.useRealTimers();
    });

    it("never drops a player below zero", () => {
        window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ p1: 1, p2: 50 }),
        );
        render(<AuthorityBoard />);

        tap("Player 1: lose 1 authority", 2);

        expect(counter("Player 1")).toHaveTextContent("0");
    });

    it("only tallies taps that actually moved the total", () => {
        window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ p1: 2, p2: 50 }),
        );
        render(<AuthorityBoard />);

        // Five taps, but only two of them can land before the floor.
        tap("Player 1: lose 1 authority", 5);

        expect(counter("Player 1")).toHaveTextContent("0");
        expect(screen.getByText("-2")).toBeInTheDocument();
        expect(screen.queryByText("-5")).not.toBeInTheDocument();
    });

    it("shows no tally at all for taps against the floor", () => {
        window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ p1: 0, p2: 50 }),
        );
        render(<AuthorityBoard />);

        tap("Player 1: lose 1 authority", 3);

        expect(counter("Player 1")).toHaveTextContent("0");
        expect(screen.queryByText("-1")).not.toBeInTheDocument();
        expect(screen.queryByText("-3")).not.toBeInTheDocument();
    });

    it("persists every change", () => {
        render(<AuthorityBoard />);

        tap("Player 2: gain 1 authority");

        expect(window.localStorage.getItem(STORAGE_KEY)).toBe(
            JSON.stringify({ p1: 50, p2: 51 }),
        );
    });

    it("only resets after the confirmation is accepted", () => {
        render(<AuthorityBoard />);

        tap("Player 1: gain 1 authority");
        tap("Start a new game");

        // Opening the dialog must not touch the score.
        expect(counter("Player 1")).toHaveTextContent("51");

        tap("New game");

        expect(counter("Player 1")).toHaveTextContent("50");
        expect(counter("Player 2")).toHaveTextContent("50");
    });
});
