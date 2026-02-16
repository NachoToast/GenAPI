import type { AlternateValidationFn } from "@/types/ValidationFns";

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
