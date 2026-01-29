import { describe, expect, test } from "bun:test";
import { ValidationError } from "@/errors/ValidationError";
import { NumberValidator } from "./Number";

describe(NumberValidator.name, () => {
    describe("constructor", () => {
        test("handles integers", () => {
            const validator = new NumberValidator(true);

            // ok
            validator.validate(Number.MIN_SAFE_INTEGER);
            validator.validate(0);
            validator.validate(Number.MAX_SAFE_INTEGER);

            // not ok
            for (const item of [
                Number.NaN,
                Number.NEGATIVE_INFINITY,
                Number.POSITIVE_INFINITY,
                0.5,
                -0.5,
            ]) {
                expect(() => validator.validate(item)).toThrowError(ValidationError);
            }
        });

        test("handles other numbers", () => {
            const validator = new NumberValidator(false);

            // ok
            validator.validate(Number.MIN_SAFE_INTEGER);
            validator.validate(Number.POSITIVE_INFINITY);
            validator.validate(-0.5);
            validator.validate(0);
            validator.validate(0.5);
            validator.validate(Number.MAX_SAFE_INTEGER);
            validator.validate(Number.NEGATIVE_INFINITY);

            // not ok
            expect(() => validator.validate(Number.NaN)).toThrowError(ValidationError);
        });
    });

    describe(NumberValidator.prototype.setMin.name, () => {
        test("handles null", () => {
            const validator = new NumberValidator(true).setMin(null);

            validator.validate(Number.MIN_SAFE_INTEGER);
        });

        test("respects minimum value", () => {
            const validator = new NumberValidator(true).setMin(0);

            expect(() => validator.validate(-1)).toThrowError(ValidationError);

            validator.validate(1);
        });
    });

    describe(NumberValidator.prototype.setMax.name, () => {
        test("handles null", () => {
            const validator = new NumberValidator(true).setMax(null);

            validator.validate(Number.MAX_SAFE_INTEGER);
        });

        test("respects maximum value", () => {
            const validator = new NumberValidator(true).setMax(0);

            validator.validate(-1);

            expect(() => validator.validate(1)).toThrowError(ValidationError);
        });
    });

    describe("enum values", () => {
        test("throws if empty", () => {
            expect(() => new NumberValidator(true).setEnum([])).toThrowError(Error);
        });

        test("handles singular", () => {
            const single = [5];

            const validator = new NumberValidator(true).setEnum(single);

            validator.validate(single[0]);

            expect(() => validator.validate(6)).toThrowError(ValidationError);
        });

        test("handles multiple", () => {
            const multiple = [1, 2];

            const validator = new NumberValidator(true).setEnum(multiple);

            validator.validate(multiple[0]);
            validator.validate(multiple[1]);

            expect(() => validator.validate(3)).toThrowError(ValidationError);
        });
    });
});
