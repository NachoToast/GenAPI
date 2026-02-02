import { ValidationError } from "@/errors/ValidationError";
import { SingleValidator } from "./SingleValidator";
import { Validator } from "./Validator";

export class StringValidator extends SingleValidator<string> {
    public constructor() {
        super("string");
    }

    public setMinLength(x: number | null): this {
        if (x === null) {
            return this;
        }

        const characters = x === 1 ? "character" : "characters";
        const message = `Cannot be less than ${x} ${characters} long`;

        return this.addValidator((input) => {
            if (input.length < x) {
                throw new ValidationError(message);
            }
        });
    }

    public setMaxLength(x: number | null): this {
        if (x === null) {
            return this;
        }

        const characters = x === 1 ? "character" : "characters";
        const message = `Cannot be more than ${x} ${characters} long`;

        return this.addValidator((input) => {
            if (input.length > x) {
                throw new ValidationError(message);
            }
        });
    }

    public setEnum(values: string[]): this {
        if (values.length === 0) {
            throw new Error("Cannot setEnum with 0 values");
        }

        if (values.length === 1) {
            const target = values[0];

            const message = `Must be "${target}"`;

            return this.addValidator((input) => {
                if (input !== target) {
                    throw new ValidationError(message);
                }
            });
        }

        const message = `Must be ${Validator.toList(values.map((x) => `"${x}"`))}`;

        const allowed = new Set(values);

        return this.addValidator((input) => {
            if (!allowed.has(input)) {
                throw new ValidationError(message);
            }
        });
    }
}
