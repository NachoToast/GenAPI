import { ValidationError } from "@/errors/ValidationError";
import { SingleValidator } from "./SingleValidator";
import { Validator } from "./Validator";

export class NumberValidator extends SingleValidator<number> {
    public constructor(isInteger: boolean) {
        super("number");

        if (isInteger) {
            this.addValidator((input) => {
                if (!Number.isInteger(input)) {
                    throw new ValidationError("Should be an integer");
                }
            });
        } else {
            this.addValidator((input) => {
                if (Number.isNaN(input)) {
                    throw new ValidationError("Should be a valid number (got NaN)");
                }
            });
        }
    }

    public setMin(x: number | null): this {
        if (x === null) {
            return this;
        }

        const message = `Cannot be less than ${x}`;

        return this.addValidator((input) => {
            if (input < x) {
                throw new ValidationError(message);
            }
        });
    }

    public setMax(x: number | null): this {
        if (x === null) {
            return this;
        }

        const message = `Cannot be greater than ${x}`;

        return this.addValidator((input) => {
            if (input > x) {
                throw new ValidationError(message);
            }
        });
    }

    public setEnum(values: number[]): this {
        if (values.length === 0) {
            throw new Error("Cannot setEnum with 0 values");
        }

        if (values.length === 1) {
            const target = values[0];

            const message = `Must be ${target}`;

            return this.addValidator((input) => {
                if (input !== target) {
                    throw new ValidationError(message);
                }
            });
        }

        const message = `Must be ${Validator.toList(values.map((x) => x.toString()))}`;

        const allowed = new Set(values);

        return this.addValidator((input) => {
            if (!allowed.has(input)) {
                throw new ValidationError(message);
            }
        });
    }
}
