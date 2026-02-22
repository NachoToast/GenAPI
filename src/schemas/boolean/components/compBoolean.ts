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

export const compBoolean: SchemaComponent<boolean> = {
    getName(): string {
        return "type(boolean)";
    },

    doSchemaActions(schema: OAS.Schema): void {
        schema.type = "boolean";
    },

    *getTypeValidators(): Generator<TypeValidationFn<boolean>> {
        yield ensureIsBoolean;
    },

    *getTypeValidationSummary(): Generator<string> {
        yield "a boolean";
    },

    conflictsWith(other: SchemaComponent<boolean>): boolean {
        return other === this;
    },
};
