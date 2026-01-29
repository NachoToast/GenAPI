import { describe, expect, test } from "bun:test";
import { Validator } from "./Validator";

describe(Validator.name, () => {
    test(Validator["getNounFor"].name, () => {
        const fn = Validator["getNounFor"];

        expect(fn("object")).toBe("an object");
        expect(fn("undefined")).toBe("undefined");
        expect(fn("number")).toBe("a number");
    });

    test(Validator["toList"].name, () => {
        const fn = Validator["toList"];

        expect(fn([])).toBe("");
        expect(fn(["a"])).toBe("a");
        expect(fn(["a", "b"])).toBe("a or b");
        expect(fn(["a", "b", "c"])).toBe("a, b, or c");
        expect(fn(["a", "b", "c", "d"])).toBe("a, b, c, or d");
    });
});
