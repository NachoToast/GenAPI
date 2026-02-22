import type { OAS } from "@/OAS";
import type { AlternateValidationFn } from "@/types/ValidationFns";
import type { SchemaComponent } from "../SchemaComponent";

function isNull(input: unknown): input is null {
    return input === null;
}

export const compNullable: SchemaComponent<unknown> = {
    getName(): string {
        return "nullable";
    },

    doSchemaActions(schema: OAS.Schema): void {
        schema.nullable = true;
    },

    *getAlternateValidators(): Generator<AlternateValidationFn> {
        yield isNull;
    },

    *getTypeValidationSummary(): Generator<string> {
        yield "null";
    },

    conflictsWith(other: SchemaComponent<unknown>): boolean {
        return other === this;
    },
};
