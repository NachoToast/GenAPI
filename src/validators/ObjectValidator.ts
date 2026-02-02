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

            if (Array.isArray(input)) {
                throw new ValidationError("Cannot be an array");
            }
        });
    }

    public setRequiredKeys(keys: string[]): this {
        const requiredKeys = new Set(keys);

        if (requiredKeys.size === 0) {
            return this;
        }

        return this.addValidator((input) => {
            const missingKeys = new Set<string>();

            for (const key of requiredKeys) {
                if (!Object.hasOwn(input, key)) {
                    missingKeys.add(key);
                }
            }

            if (missingKeys.size > 0) {
                const properties = missingKeys.size === 1 ? "properties" : "property";

                throw new ValidationError(
                    `Missing required ${properties}: "${[...missingKeys].join(", ")}"`,
                );
            }
        });
    }

    /** Adds a validator that is always executed. */
    public addRequiredSubValidator(key: string, fn: (subInput: unknown) => void): this {
        return this.addValidator((input) => {
            try {
                fn(input[key]);
            } catch (error) {
                if (!(error instanceof ValidationError)) {
                    throw error;
                }

                throw new ValidationError(`${key}: ${error.message}`);
            }
        });
    }

    /** Adds a validator that is only executed when the given {@link key} is present. */
    public addOptionalSubValidator(key: string, fn: (subInput: unknown) => void): this {
        return this.addValidator((input) => {
            if (!Object.hasOwn(input, key)) return;

            try {
                fn(input[key]);
            } catch (error) {
                if (!(error instanceof ValidationError)) {
                    throw error;
                }

                throw new ValidationError(`${key}: ${error.message}`);
            }
        });
    }
}
