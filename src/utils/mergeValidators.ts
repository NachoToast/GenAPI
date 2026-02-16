import type { ValidationFn } from "@/types/ValidationFns";

export function mergeValidators<T>(validators: ValidationFn<T>[]): ValidationFn<T> {
    return (input: T) => {
        for (const validator of validators) {
            validator(input);
        }
    };
}
