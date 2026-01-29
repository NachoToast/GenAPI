import { ValidationError } from "@/errors/ValidationError";
import type { SingleValidator } from "./SingleValidator";
import { Validator } from "./Validator";

type AnyValidatable = string | number | object;

interface ValidationPath<T = AnyValidatable> {
    validateType(input: unknown): asserts input is T;

    validateRest(input: T): void;
}

export class UnionValidator extends Validator {
    private readonly validationPaths: ValidationPath[];

    private readonly baseMessage: string;

    public constructor(validators: SingleValidator<AnyValidatable>[]) {
        if (validators.length === 0) {
            throw new Error("Cannot create a UnionValidator with no validators");
        }

        super();

        this.validationPaths = [];

        for (const validator of validators) {
            this.validationPaths.push({
                validateType: validator.validateType,
                validateRest: validator.validateRest,
            });
        }

        const allowedTypes = validators.map((v) => v.reportedInitialType);

        this.baseMessage = `Expected ${Validator.toList(allowedTypes)} but got`;
    }

    public override validate(input: unknown): void {
        let validateRestFn: (() => void) | null = null;

        for (const path of this.validationPaths) {
            try {
                path.validateType(input);

                validateRestFn = (): void => path.validateRest(input);

                break;
            } catch (error) {
                if (!(error instanceof ValidationError)) {
                    throw error;
                }

                // Swallow validation errors here, since we wouldn't know which one to show.
            }
        }

        if (validateRestFn === null) {
            throw new ValidationError(`${this.baseMessage} ${Validator.getNounFor(typeof input)}`);
        }

        validateRestFn();
    }
}
