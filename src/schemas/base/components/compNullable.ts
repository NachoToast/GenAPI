import type { OAS } from "@/OAS";
import type { AlternateValidationFn } from "@/types/ValidationFns";
import type { SchemaComponent } from "../SchemaComponent";

function isNull(input: unknown): input is null {
    return input === null;
}

/** Sets the schema `nullable` field to true and allows `null` inputs in validation. */
export const compNullable: SchemaComponent<unknown> = {
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
