import { describe, expect, mock, test } from "bun:test";
import { ValidationError } from "@/errors/ValidationError";
import { testObjects, testValuesExcept } from "@/tests/testValues";
import { ObjectValidator } from "./ObjectValidator";

describe(ObjectValidator.name, () => {
    describe(ObjectValidator.prototype.validate.name, () => {
        test("handles objects", () => {
            const validator = new ObjectValidator();

            for (const value of testObjects) {
                validator.validate(value);
            }
        });

        test("throws a ValidationError on non-objects", () => {
            const validator = new ObjectValidator();

            for (const value of testValuesExcept("objects")) {
                expect(() => validator.validate(value)).toThrowError(ValidationError);
            }
        });
    });

    describe(ObjectValidator.prototype.setRequiredKeys.name, () => {
        test("does not set any required keys if an empty array is provided", () => {
            const validator = new ObjectValidator().setRequiredKeys([]);

            validator.validate({});
            validator.validate({ foo: "bar" });
        });

        test("throws an error if any required keys are missing", () => {
            const validator = new ObjectValidator().setRequiredKeys(["abc", "123"]);

            validator.validate({ abc: "def", "123": 456 });
            validator.validate({ abc: "def", "123": 456, extra: true });

            expect(() => validator.validate({})).toThrowError(ValidationError);
            expect(() => validator.validate({ abc: "def" })).toThrowError(ValidationError);
            expect(() => validator.validate({ "123": 456, e: true })).toThrowError(ValidationError);
        });
    });

    describe(ObjectValidator.prototype.addRequiredSubValidator.name, () => {
        test("handles a sub-validator that doesn't throw any errors", () => {
            const fn = mock(() => {});

            const validator = new ObjectValidator().addRequiredSubValidator("foo", fn);

            validator.validate({ foo: "bar", other: Symbol() });

            expect(fn).toBeCalledTimes(1);

            expect(fn).toBeCalledWith("bar");

            validator.validate({ otherKey: "otherValue" });

            expect(fn).toBeCalledTimes(2);
        });

        test("handles a sub-validator that throws a ValidationError", () => {
            const fn = mock(() => {
                throw new ValidationError("test error");
            });

            const validator = new ObjectValidator().addRequiredSubValidator("foo", fn);

            expect(() => validator.validate({ foo: "bar", other: Symbol() })).toThrowError(
                ValidationError,
            );

            expect(fn).toBeCalledTimes(1);

            expect(fn).toBeCalledWith("bar");
        });

        test("handles a sub-validator that throws a generic Error", () => {
            const fn = mock(() => {
                throw new Error("test error");
            });

            const validator = new ObjectValidator().addRequiredSubValidator("foo", fn);

            expect(() => validator.validate({ foo: "bar", other: Symbol() })).toThrowError(Error);

            expect(fn).toBeCalledTimes(1);

            expect(fn).toBeCalledWith("bar");
        });
    });

    describe(ObjectValidator.prototype.addOptionalSubValidator.name, () => {
        test("handles a sub-validator that doesn't throw any errors", () => {
            const fn = mock(() => {});

            const validator = new ObjectValidator().addOptionalSubValidator("foo", fn);

            validator.validate({ foo: "bar", other: Symbol() });

            expect(fn).toBeCalledTimes(1);

            expect(fn).toBeCalledWith("bar");

            validator.validate({ otherKey: "otherValue" });

            expect(fn).toBeCalledTimes(1);
        });

        test("handles a sub-validator that throws a ValidationError", () => {
            const fn = mock(() => {
                throw new ValidationError("test error");
            });

            const validator = new ObjectValidator().addOptionalSubValidator("foo", fn);

            expect(() => validator.validate({ foo: "bar", other: Symbol() })).toThrowError(
                ValidationError,
            );

            expect(fn).toBeCalledTimes(1);

            expect(fn).toBeCalledWith("bar");

            validator.validate({ otherKey: "otherValue" });

            expect(fn).toBeCalledTimes(1);
        });

        test("handles a sub-validator that throws a generic Error", () => {
            const fn = mock(() => {
                throw new Error("test error");
            });

            const validator = new ObjectValidator().addOptionalSubValidator("foo", fn);

            expect(() => validator.validate({ foo: "bar", other: Symbol() })).toThrowError(Error);

            expect(fn).toBeCalledTimes(1);

            expect(fn).toBeCalledWith("bar");
        });
    });
});
