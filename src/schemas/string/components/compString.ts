import { ValidationError } from "@/errors/ValidationError";
import type { OAS } from "@/OAS";
import type { SchemaComponent } from "@/schemas/base/SchemaComponent";
import type { TypeValidationFn } from "@/types/ValidationFns";
import { getTypeName } from "@/utils/getTypeName";

function ensureIsString(input: unknown): asserts input is string {
    const type = typeof input;

    if (type !== "string") {
        throw new ValidationError(`Expected a string but got ${getTypeName(type)}`);
    }
}

export const compString: SchemaComponent<string> = {
    getName(): string {
        return "type(string)";
    },

    doSchemaActions(schema: OAS.Schema): void {
        schema.type = "string";
    },

    *getTypeValidators(): Generator<TypeValidationFn<string>> {
        yield ensureIsString;
    },

    *getTypeValidationSummary(): Generator<string> {
        yield "a string";
    },

    conflictsWith(other: SchemaComponent<string>): boolean {
        return other === this;
    },
};
