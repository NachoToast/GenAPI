import { describe, expect, test } from "bun:test";
import { ValidationError } from "@/errors/ValidationError";
import { NumberValidator } from "./Number";
import { SingleValidator } from "./SingleValidator";
import { StringValidator } from "./String";

const testCases = {
    strings: ["", "example", "\n"],

    numbers: [
        Number.NaN,
        Number.MAX_SAFE_INTEGER,
        Number.MIN_SAFE_INTEGER,
        Number.MAX_VALUE,
        Number.MIN_VALUE,
        Number.POSITIVE_INFINITY,
        Number.NEGATIVE_INFINITY,
        -1,
        -0.5,
        0,
        0.5,
        1,
    ],

    arrays: [[], ["single"], ["a", "b"], ["a", 1, "b", 2]],

    objects: [{}, { foo: "bar" }],

    booleans: [true, false],

    other: [null, undefined, Symbol()],
} as const;

function testCasesExcept(excludedKey: keyof typeof testCases): unknown[] {
    const output: unknown[] = [];

    for (const [key, value] of Object.entries(testCases)) {
        if (key === excludedKey) continue;

        output.push(...value);
    }

    return output;
}

describe(SingleValidator.name, () => {
    test("string", () => {
        const validator: StringValidator = new StringValidator();

        for (const item of testCases.strings) {
            validator.validateType(item);
        }

        for (const item of testCasesExcept("strings")) {
            expect(() => validator.validateType(item)).toThrowError(ValidationError);
        }
    });

    test("number", () => {
        const validator: NumberValidator = new NumberValidator(false);

        for (const item of testCases.numbers) {
            validator.validateType(item);
        }

        for (const item of testCasesExcept("numbers")) {
            expect(() => validator.validateType(item)).toThrowError(ValidationError);
        }
    });
});
