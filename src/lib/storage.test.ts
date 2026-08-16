import {
    parseGame,
    readGame,
    restoreScriptSource,
    STORAGE_KEY,
    writeGame,
} from "^/lib/storage";

describe("parseGame", () => {
    it("falls back to a new game when nothing is stored", () => {
        expect(parseGame(null)).toEqual({ p1: 50, p2: 50 });
    });

    it("round-trips a stored game", () => {
        expect(parseGame('{"p1":43,"p2":12}')).toEqual({ p1: 43, p2: 12 });
    });

    it("clamps stored negatives", () => {
        expect(parseGame('{"p1":-5,"p2":10}')).toEqual({ p1: 0, p2: 10 });
    });

    it.each([
        ["invalid json", "{not json"],
        ["a json primitive", '"50"'],
        ["null", "null"],
        ["a missing player", '{"p1":40}'],
        ["a non-numeric player", '{"p1":"40","p2":50}'],
        ["a non-finite player", '{"p1":null,"p2":50}'],
    ])("falls back to a new game for %s", (_label, raw) => {
        expect(parseGame(raw)).toEqual({ p1: 50, p2: 50 });
    });
});

describe("readGame / writeGame", () => {
    beforeEach(() => {
        window.localStorage.clear();
    });

    it("persists and restores a game", () => {
        writeGame({ p1: 31, p2: 7 });
        expect(readGame()).toEqual({ p1: 31, p2: 7 });
    });

    it("reads a new game when storage is empty", () => {
        expect(readGame()).toEqual({ p1: 50, p2: 50 });
    });

    it("survives storage throwing", () => {
        const getItem = jest
            .spyOn(Storage.prototype, "getItem")
            .mockImplementation(() => {
                throw new Error("denied");
            });

        expect(readGame()).toEqual({ p1: 50, p2: 50 });
        expect(() => writeGame({ p1: 1, p2: 2 })).not.toThrow();

        getItem.mockRestore();
    });
});

describe("restoreScriptSource", () => {
    /** Runs the inline script the way the browser would, before hydration. */
    function runRestoreScript() {
        eval(restoreScriptSource());
    }

    beforeEach(() => {
        window.localStorage.clear();
        document.body.innerHTML =
            '<span id="authority-p1">50</span>' +
            '<span id="authority-p2">50</span>';
    });

    it("references the same storage key the app writes", () => {
        expect(restoreScriptSource()).toContain(STORAGE_KEY);
    });

    it("patches both numbers from storage", () => {
        writeGame({ p1: 43, p2: 12 });
        runRestoreScript();

        expect(document.getElementById("authority-p1")?.textContent).toBe("43");
        expect(document.getElementById("authority-p2")?.textContent).toBe("12");
    });

    it("leaves the prerendered numbers alone when nothing is stored", () => {
        runRestoreScript();

        expect(document.getElementById("authority-p1")?.textContent).toBe("50");
    });

    it("does not throw on a corrupt value", () => {
        window.localStorage.setItem(STORAGE_KEY, "{not json");

        expect(runRestoreScript).not.toThrow();
        expect(document.getElementById("authority-p1")?.textContent).toBe("50");
    });
});
