import { describe, expect, test } from "bun:test";
import { ValidationError } from "@/errors/ValidationError";
import { testIntegers, testNumbers, testValuesExcept } from "@/tests/testValues";
import { NumberValidator } from "./NumberValidator";

describe(NumberValidator.name, () => {
    describe(NumberValidator.prototype.validate.name, () => {
        test("handles integers when isInteger is true", () => {
            const validator = new NumberValidator(true);

            for (const value of testIntegers) {
                validator.validate(value);
            }
        });

        test("throws a ValidationError on non-integers when isInteger is true", () => {
            const validator = new NumberValidator(true);

            for (const value of testValuesExcept("integers")) {
                expect(() => validator.validate(value)).toThrowError(ValidationError);
            }
        });

        test("handles all numbers when isInteger is false", () => {
            const validator = new NumberValidator(false);

            for (const value of testNumbers) {
                validator.validate(value);
            }
        });

        test("throws a ValidationError on non-numbers when isInteger is false", () => {
            const validator = new NumberValidator(false);

            for (const value of testValuesExcept("integers", "nonIntegers")) {
                expect(() => validator.validate(value)).toThrowError(ValidationError);
            }
        });
    });

    describe(NumberValidator.prototype.setMin.name, () => {
        test("does not set a minimum value if null", () => {
            const validator = new NumberValidator(true).setMin(null);

            validator.validate(Number.MIN_SAFE_INTEGER);
        });

        test("respects the minimum value", () => {
            const validator = new NumberValidator(true).setMin(0);

            expect(() => validator.validate(-1)).toThrowError(ValidationError);

            validator.validate(1);
        });
    });

    describe(NumberValidator.prototype.setMax.name, () => {
        test("does not set a maximum value if null", () => {
            const validator = new NumberValidator(true).setMax(null);

            validator.validate(Number.MAX_SAFE_INTEGER);
        });

        test("respects the maximum value", () => {
            const validator = new NumberValidator(true).setMax(0);

            validator.validate(-1);

            expect(() => validator.validate(1)).toThrowError(ValidationError);
        });
    });

    describe(NumberValidator.prototype.setEnum.name, () => {
        test("throws a ParserError if an empty array is provided", () => {
            expect(() => new NumberValidator(true).setEnum([])).toThrowError(Error);
        });

        test("respects arrays with one item", () => {
            const single = [5];

            const validator = new NumberValidator(true).setEnum(single);

            validator.validate(single[0]);

            expect(() => validator.validate(6)).toThrowError(ValidationError);
        });

        test("respects arrays with multiple items", () => {
            const multiple = [1, 2];

            const validator = new NumberValidator(true).setEnum(multiple);

            validator.validate(multiple[0]);
            validator.validate(multiple[1]);

            expect(() => validator.validate(3)).toThrowError(ValidationError);
        });
    });
});
