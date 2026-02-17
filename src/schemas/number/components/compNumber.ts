import { ValidationError } from "@/errors/ValidationError";
import type { OAS } from "@/OAS";
import type { SchemaComponent } from "@/schemas/base/SchemaComponent";
import type { TypeValidationFn, ValueValidationFn } from "@/types/ValidationFns";
import { getTypeName } from "@/utils/getTypeName";

function ensureIsNumber(input: unknown): asserts input is number {
    const type = typeof input;

    if (type !== "number") {
        throw new ValidationError(`Expected a number but got ${getTypeName(type)}`);
    }
}

function ensureIsValidNumber(input: number): void {
    if (Number.isNaN(input)) {
        throw new ValidationError("Must be a valid number");
    }
}

/** Sets the schema `type` field to "number" and validates input types accordingly. */
export const compNumber: SchemaComponent<number> = {
    doSchemaActions(schema: OAS.Schema): void {
        schema.type = "number";
    },

    *getTypeValidators(): Generator<TypeValidationFn<number>> {
        yield ensureIsNumber;
    },

    *getValueValidators(): Generator<ValueValidationFn<number>> {
        yield ensureIsValidNumber;
    },

    *getValidationSummary(): Generator<string> {
        yield "a number";
    },
};
