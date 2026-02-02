import { describe, expect, test } from "bun:test";
import { Validator } from "./Validator";

describe(Validator.name, () => {
    describe(Validator["getNounFor"].name, () => {
        const fn = Validator["getNounFor"];

        test("uses the right indefinite article", () => {
            expect(fn("object")).toBe("an object");
            expect(fn("undefined")).toBe("undefined");
            expect(fn("number")).toBe("a number");
        });
    });

    describe(Validator["toList"].name, () => {
        const fn = Validator["toList"];

        test("returns an empty string for an empty array", () => {
            expect(fn([])).toBe("");
        });

        test("returns a single item directly", () => {
            expect(fn(["a"])).toBe("a");
        });

        test("does simple conjunction between two items", () => {
            expect(fn(["a", "b"])).toBe("a or b");
        });

        test("does list formatting for three or more items", () => {
            expect(fn(["a", "b", "c"])).toBe("a, b, or c");
            expect(fn(["a", "b", "c", "d"])).toBe("a, b, c, or d");
        });
    });
});
