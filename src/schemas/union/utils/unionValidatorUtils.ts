import { ValidationError } from "@/errors/ValidationError";
import type { SchemaObject } from "@/schemas/base/SchemaObject";
import type {
    AlternateValidationFn,
    FinalValidationFn,
    TypeValidationFn,
    ValueValidationFn,
} from "@/types/ValidationFns";
import { formatList } from "@/utils/formatList";
import { mergeAlternateValidators, mergeValidators } from "@/utils/validation";

interface ValidationPath {
    typeValidator: TypeValidationFn<unknown>;

    valueValidator: ValueValidationFn<unknown>;
}

function makeFinalValidator(
    validationPaths: ValidationPath[],
    alternateValidator: AlternateValidationFn,
    message: string,
): FinalValidationFn {
    return (input: unknown) => {
        if (alternateValidator(input)) return;

        let chosenPath: ValidationPath | null = null;

        for (const path of validationPaths) {
            try {
                path.typeValidator(input);

                chosenPath = path;
                break;
            } catch (error) {
                if (!(error instanceof ValidationError)) {
                    throw error;
                }

                // Swallow validation errors here, since we wouldn't know which one to show.
            }
        }

        if (chosenPath !== null) {
            chosenPath.valueValidator(input);
        } else {
            throw new ValidationError(message);
        }
    };
}

export function makeUnionValidator(schemas: SchemaObject<unknown>[]): FinalValidationFn {
    const alternateValidators: AlternateValidationFn[] = [];
    const validationPaths: ValidationPath[] = [];
    const validationSummary: string[] = [];

    for (const schema of schemas) {
        const typeValidators: TypeValidationFn<unknown>[] = [];
        const valueValidators: ValueValidationFn<unknown>[] = [];

        for (const component of schema.components) {
            if (component.getTypeValidators !== undefined) {
                typeValidators.push(...component.getTypeValidators());
            }

            if (component.getValueValidators !== undefined) {
                valueValidators.push(...component.getValueValidators());
            }

            if (component.getAlternateValidators !== undefined) {
                alternateValidators.push(...component.getAlternateValidators());
            }

            if (component.getValidationSummary !== undefined) {
                validationSummary.push(...component.getValidationSummary());
            }
        }

        validationPaths.push({
            typeValidator: mergeValidators(typeValidators),
            valueValidator: mergeValidators(valueValidators),
        });
    }

    const alternateValidator = mergeAlternateValidators(alternateValidators);

    const message = `Expected ${formatList(validationSummary, "or")}`;

    return makeFinalValidator(validationPaths, alternateValidator, message);
}
