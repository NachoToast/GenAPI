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

export const compUndefined: SchemaComponent<undefined> = {
    getName(): string {
        return "type(undefined)";
    },

    doSchemaActions(schema: OAS.Schema): void {
        schema.description ??= "Represents the `undefined` type.";
    },

    *getTypeValidators(): Generator<TypeValidationFn<undefined>> {
        yield ensureIsUndefined;
    },

    *getTypeValidationSummary(): Generator<string> {
        yield "undefined";
    },

    conflictsWith(other: SchemaComponent<undefined>): boolean {
        return other === this;
    },
};
