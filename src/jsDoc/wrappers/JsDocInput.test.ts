import { describe, expect, test } from "bun:test";
import { ParserError } from "@/errors/ParserError";
import { createDefaultTestNode } from "@/tests/createDefaultTestNode";
import { testIntegers, testNumbers, testStrings } from "@/tests/testValues";
import { JsDocInput } from "./JsDocInput";

describe(JsDocInput.name, () => {
    const node = createDefaultTestNode();

    describe(JsDocInput.prototype.string.name, () => {
        test("creates an output for regular strings", () => {
            for (const value of testStrings) {
                const result = new JsDocInput(node, "someTag", value).string();

                expect(result.value).toBe(value);
            }
        });

        test("creates an output for double-quoted strings", () => {
            for (const value of testStrings) {
                const result = new JsDocInput(node, "someTag", `"${value}"`).string();

                expect(result.value).toBe(value);
            }
        });
    });

    describe(JsDocInput.prototype.number.name, () => {
        test("creates an output for numeric strings", () => {
            for (const value of testNumbers) {
                const result = new JsDocInput(node, "someTag", value.toString()).number();

                expect(result.value).toBe(value);
            }
        });

        test("throws a ParserError for non-numeric strings", () => {
            for (const value of testStrings) {
                const invalidInput = new JsDocInput(node, "someTag", value);

                expect(() => invalidInput.number()).toThrowError(ParserError);
            }
        });
    });

    describe(JsDocInput.prototype.integer.name, () => {
        test("creates an output for integer strings ", () => {
            for (const value of testIntegers) {
                const result = new JsDocInput(node, "someTag", value.toString()).integer();

                expect(result.value).toBe(value);
            }
        });

        test("throws a ParserError for non-integer strings", () => {
            for (const value of testStrings) {
                const instance = new JsDocInput(node, "someTag", value);

                expect(() => instance.integer()).toThrowError(ParserError);
            }
        });
    });
});
