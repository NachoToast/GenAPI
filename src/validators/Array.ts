import { ValidationError } from "@/errors/ValidationError";
import { SingleValidator } from "./SingleValidator";

export class ArrayValidator<Item> extends SingleValidator<Item[]> {
    public constructor() {
        super("object", "an array");

        this.addValidator((input) => {
            if (!Array.isArray(input)) {
                throw new ValidationError("Should be an array");
            }
        });
    }

    public setItems(fn: (input: unknown) => void): this {
        return this.addValidator((input) => {
            for (let i = 0; i < input.length; i++) {
                try {
                    fn(input[i]);
                } catch (error) {
                    if (!(error instanceof ValidationError)) {
                        throw error;
                    }

                    throw new ValidationError(`[${i}] ${error.message}`);
                }
            }
        });
    }

    public setMinLength(x: number | null): this {
        if (x === null) {
            return this;
        }

        const items = x === 1 ? "item" : "items";
        const message = `Cannot contain less than ${x} ${items}`;

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

        const items = x === 1 ? "item" : "items";
        const message = `Cannot contain more than ${x} ${items}`;

        return this.addValidator((input) => {
            if (input.length > x) {
                throw new ValidationError(message);
            }
        });
    }
}
