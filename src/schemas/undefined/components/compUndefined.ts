import { ValidationError } from "@/errors/ValidationError";
import type { OAS } from "@/OAS";
import type { SchemaComponent } from "@/schemas/base/SchemaComponent";
import type { TypeValidationFn } from "@/types/ValidationFns";
import { getTypeName } from "@/utils/getTypeName";

function ensureIsUndefined(input: unknown): asserts input is undefined {
    const type = typeof input;

    if (type !== "undefined") {
        throw new ValidationError(`Expected undefined but got ${getTypeName(type)}`);
    }
}

/**
 * Signifies the schema as representing the `undefined` type and validates inputs against
 * `undefined`.
 */
export const compUndefined: SchemaComponent<undefined> = {
    doSchemaActions(schema: OAS.Schema): void {
        schema.description ??= "Represents the `undefined` type.";
    },

    *getTypeValidators(): Generator<TypeValidationFn<undefined>> {
        yield ensureIsUndefined;
    },

    *getValidationSummary(): Generator<string> {
        yield "undefined";
    },
};
