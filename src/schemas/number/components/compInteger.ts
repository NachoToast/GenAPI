import { ValidationError } from "@/errors/ValidationError";
import type { OAS } from "@/OAS";
import type { SchemaComponent } from "@/schemas/base/SchemaComponent";
import type { TypeValidationFn, ValueValidationFn } from "@/types/ValidationFns";
import { getTypeName } from "@/utils/getTypeName";

function ensureIsNumber(input: unknown): asserts input is number {
    const type = typeof input;

    if (type !== "number") {
        throw new ValidationError(`Expected an integer but got ${getTypeName(type)}`);
    }
}

function ensureIsInteger(input: number): void {
    if (!Number.isSafeInteger(input)) {
        throw new ValidationError("Must be a valid integer");
    }
}

/** Sets the schema `type` field to "integer" and validates input types accordingly. */
export const compInteger: SchemaComponent<number> = {
    doSchemaActions(schema: OAS.Schema): void {
        schema.type = "integer";
    },

    *getTypeValidators(): Generator<TypeValidationFn<number>> {
        yield ensureIsNumber;
    },

    *getValueValidators(): Generator<ValueValidationFn<number>> {
        yield ensureIsInteger;
    },

    *getValidationSummary(): Generator<string> {
        yield "an integer";
    },
};
