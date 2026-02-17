import type {
    AlternateValidationFn,
    FinalValidationFn,
    TypeValidationFn,
    ValueValidationFn,
} from "@/types/ValidationFns";

export function mergeValidators<T>(validators: ValueValidationFn<T>[]): ValueValidationFn<T> {
    return (input: T) => {
        for (const validator of validators) {
            validator(input);
        }
    };
}

export function mergeAlternateValidators(
    validators: AlternateValidationFn[],
): AlternateValidationFn {
    return (input: unknown) => {
        for (const validator of validators) {
            if (validator(input)) {
                return true;
            }
        }

        return false;
    };
}

export function makeFinalValidator<T>(
    typeValidator: TypeValidationFn<T>,
    valueValidator: ValueValidationFn<T>,
    alternateValidator: AlternateValidationFn,
): FinalValidationFn {
    return (input: unknown) => {
        if (alternateValidator(input)) return;

        typeValidator(input);

        valueValidator(input);
    };
}
