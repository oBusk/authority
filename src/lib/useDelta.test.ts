import { act, renderHook } from "@testing-library/react";
import { DELTA_TIMEOUT_MS, useDelta } from "^/lib/useDelta";

describe("useDelta", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("starts with nothing to show", () => {
        const { result } = renderHook(() => useDelta());
        expect(result.current.value).toBe(0);
    });

    it("accumulates a run of taps", () => {
        const { result } = renderHook(() => useDelta());

        act(() => {
            for (let i = 0; i < 7; i++) {
                result.current.add(1);
            }
        });

        expect(result.current.value).toBe(7);
    });

    it("nets out mixed taps", () => {
        const { result } = renderHook(() => useDelta());

        act(() => {
            result.current.add(5);
        });
        act(() => {
            result.current.add(-2);
        });

        expect(result.current.value).toBe(3);
    });

    it("clears once the player stops tapping", () => {
        const { result } = renderHook(() => useDelta());

        act(() => {
            result.current.add(4);
        });
        act(() => {
            jest.advanceTimersByTime(DELTA_TIMEOUT_MS);
        });

        expect(result.current.value).toBe(0);
    });

    it("restarts the window on each tap", () => {
        const { result } = renderHook(() => useDelta());

        act(() => {
            result.current.add(1);
        });
        act(() => {
            jest.advanceTimersByTime(DELTA_TIMEOUT_MS - 100);
        });
        act(() => {
            result.current.add(1);
        });

        // Past the original deadline, but not the one the second tap set.
        act(() => {
            jest.advanceTimersByTime(200);
        });
        expect(result.current.value).toBe(2);

        act(() => {
            jest.advanceTimersByTime(DELTA_TIMEOUT_MS);
        });
        expect(result.current.value).toBe(0);
    });

    it("clears immediately on reset", () => {
        const { result } = renderHook(() => useDelta());

        act(() => {
            result.current.add(9);
        });
        act(() => {
            result.current.reset();
        });

        expect(result.current.value).toBe(0);
    });
});
