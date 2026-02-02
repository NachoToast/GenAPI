import { describe, expect, test } from "bun:test";
import { ValidationError } from "@/errors/ValidationError";
import { testStrings, testValuesExcept } from "@/tests/testValues";
import { StringValidator } from "./StringValidator";

describe(StringValidator.name, () => {
    const long = "long long string";
    const medium = "medium string";
    const short = "short";

    describe(StringValidator.prototype.validate.name, () => {
        test("handles strings", () => {
            const validator = new StringValidator();

            for (const value of testStrings) {
                validator.validate(value);
            }
        });

        test("throws a ValidationError on non-strings", () => {
            const validator = new StringValidator();

            for (const value of testValuesExcept("strings")) {
                expect(() => validator.validate(value)).toThrowError(ValidationError);
            }
        });
    });

    describe(StringValidator.prototype.setMinLength.name, () => {
        test("does not set a minimum length if null", () => {
            const validator = new StringValidator().setMinLength(null);

            validator.validate("");
        });

        test("respects the minimum length", () => {
            const validator = new StringValidator().setMinLength(medium.length);

            expect(() => validator.validate(short)).toThrowError(ValidationError);

            validator.validate(medium);
            validator.validate(long);
        });
    });

    describe(StringValidator.prototype.setMaxLength.name, () => {
        test("does not set a maximum length if null", () => {
            const validator = new StringValidator().setMaxLength(null);

            validator.validate("a very very very very long string");
        });

        test("respects the maximum length", () => {
            const validator = new StringValidator().setMaxLength(medium.length);

            validator.validate(short);
            validator.validate(medium);

            expect(() => validator.validate(long)).toThrowError(ValidationError);
        });
    });

    describe(StringValidator.prototype.setEnum.name, () => {
        test("throws a ParserError if an empty array is provided", () => {
            expect(() => new StringValidator().setEnum([])).toThrowError(Error);
        });

        test("respects arrays with one item", () => {
            const single = ["single string value"];

            const validator = new StringValidator().setEnum(single);

            validator.validate(single[0]);

            expect(() => validator.validate("another value")).toThrowError(ValidationError);
        });

        test("respects arrays with multiple items", () => {
            const multiple = ["a", "b"];

            const validator = new StringValidator().setEnum(multiple);

            validator.validate(multiple[0]);
            validator.validate(multiple[1]);

            expect(() => validator.validate("c")).toThrowError(ValidationError);
        });
    });
});
