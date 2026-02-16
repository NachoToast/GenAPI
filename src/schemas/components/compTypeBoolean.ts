import { ValidationError } from "@/errors/ValidationError";
import type { OAS } from "@/OAS";
import type { SchemaComponent } from "@/schemas/base/SchemaComponent";
import type { TypeValidationFn } from "@/types/ValidationFns";
import { getTypeName } from "@/utils/getTypeName";

function ensureIsBoolean(input: unknown): asserts input is boolean {
    const type = typeof input;

    if (type !== "boolean") {
        throw new ValidationError(`Expected a boolean but got ${getTypeName(type)}`);
    }
}

/** Sets the schema `type` field to "boolean" and validates input types accordingly. */
export const compTypeBoolean: SchemaComponent<boolean> = {
    copyToIdentified(): SchemaComponent<boolean> {
        return this;
    },

    doSchemaActions(schema: OAS.Schema): void {
        schema.type = "boolean";
    },

    *getTypeValidators(): Generator<TypeValidationFn<boolean>> {
        yield ensureIsBoolean;
    },

    *getValidationSummary(): Generator<string> {
        yield "a boolean";
    },
};
