import { ValidationError } from "@/errors/ValidationError";
import type { AnyObject } from "@/types/AnyObject";
import { SingleValidator } from "./SingleValidator";

export class ObjectValidator extends SingleValidator<AnyObject> {
    public constructor() {
        super("object");

        this.addValidator((input) => {
            if (input === null) {
                throw new ValidationError("Cannot be null");
            }
        });
    }

    public setKeys(keys: string[]): this {
        return this.addValidator((input) => {
            const keySet = new Set(keys);

            for (const key of Object.keys(input)) {
                if (!keySet.delete(key)) {
                    throw new ValidationError(`Unrecognised property "${key}"`);
                }
            }

            if (keySet.size > 0) {
                const properties = keySet.size === 1 ? "properties" : "property";

                throw new ValidationError(
                    `Missing required ${properties}: "${[...keySet].join(", ")}"`,
                );
            }
        });
    }

    public addSubValidator(key: string, fn: (subInput: unknown) => void): this {
        return this.addValidator((input) => {
            const subInput = input[key];

            try {
                fn(subInput);
            } catch (error) {
                if (!(error instanceof ValidationError)) {
                    throw error;
                }

                throw new ValidationError(`${key}: ${error.message}`);
            }
        });
    }
}
