import type { OAS } from "@/OAS";
import type { AlternateValidationFn } from "@/types/ValidationFns";
import type { SchemaComponent } from "../base/SchemaComponent";

function isNull(input: unknown): input is null {
    return input === null;
}

/**
 * Sets the schema `nullable` field to true and allows `null` inputs in validation.
 *
 * Distinct from `compTypeNull` - see `compTypeNull` for more information.
 */
export const compNullable: SchemaComponent<unknown> = {
    copyToIdentified(): SchemaComponent<unknown> {
        return this;
    },

    doSchemaActions(schema: OAS.Schema): void {
        schema.nullable = true;
    },

    *getAlternateValidators(): Generator<AlternateValidationFn> {
        yield isNull;
    },

    *getValidationSummary(): Generator<string> {
        yield "null";
    },
};
