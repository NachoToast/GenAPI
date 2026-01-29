import { ValidationError } from "@/errors/ValidationError";
import { type ValidationInputType, Validator } from "./Validator";

export abstract class SingleValidator<FinalType> extends Validator {
    /** This gets used in `typeof` checks. */
    private readonly trueInitialType: ValidationInputType;

    /** This gets used in the error message from `typeof` checks. */
    public readonly reportedInitialType: string;

    private readonly baseMessage: string;

    private readonly additionalValidators: ((input: FinalType) => void)[] = [];

    protected constructor(initialType: ValidationInputType, reportedType?: string) {
        super();
        this.trueInitialType = initialType;
        this.reportedInitialType = reportedType ?? Validator.getNounFor(initialType);
        this.baseMessage = `Expected ${this.reportedInitialType} but got`;
    }

    public validateType(input: unknown): asserts input is FinalType {
        if (typeof input !== this.trueInitialType) {
            throw new ValidationError(`${this.baseMessage} ${Validator.getNounFor(typeof input)}`);
        }
    }

    public validateRest(input: FinalType): void {
        for (const validator of this.additionalValidators) {
            validator(input);
        }
    }

    public validate(input: unknown): void {
        this.validateType(input);
        this.validateRest(input);
    }

    protected addValidator(fn: (input: FinalType) => void): this {
        this.additionalValidators.push(fn);
        return this;
    }
}
