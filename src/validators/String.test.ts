import { describe, expect, test } from "bun:test";
import { ValidationError } from "@/errors/ValidationError";
import { StringValidator } from "./String";

describe(StringValidator.name, () => {
    const long = "long long string";
    const medium = "medium string";
    const short = "short";

    describe(StringValidator.prototype.setMinLength.name, () => {
        test("handles null", () => {
            const validator = new StringValidator().setMinLength(null);

            validator.validate("");
        });

        test("respects minimum length", () => {
            const validator = new StringValidator().setMinLength(medium.length);

            expect(() => validator.validate(short)).toThrowError(ValidationError);

            validator.validate(medium);
            validator.validate(long);
        });
    });

    describe(StringValidator.prototype.setMaxLength.name, () => {
        test("handles null", () => {
            const validator = new StringValidator().setMaxLength(null);

            validator.validate("");
        });

        test("respects maximum length", () => {
            const validator = new StringValidator().setMaxLength(medium.length);

            validator.validate(short);
            validator.validate(medium);

            expect(() => validator.validate(long)).toThrowError(ValidationError);
        });
    });

    describe("enum values", () => {
        test("throws if empty", () => {
            expect(() => new StringValidator().setEnum([])).toThrowError(Error);
        });

        test("handles singular", () => {
            const single = ["single string value"];

            const validator = new StringValidator().setEnum(single);

            validator.validate(single[0]);

            expect(() => validator.validate("another value")).toThrowError(ValidationError);
        });

        test("handles multiple", () => {
            const multiple = ["a", "b"];

            const validator = new StringValidator().setEnum(multiple);

            validator.validate(multiple[0]);
            validator.validate(multiple[1]);

            expect(() => validator.validate("c")).toThrowError(ValidationError);
        });
    });
});
