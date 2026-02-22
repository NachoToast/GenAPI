import { ValidationError } from "@/errors/ValidationError";
import type { OAS } from "@/OAS";
import type { SchemaComponent } from "@/schemas/base/SchemaComponent";
import type { TypeValidationFn, ValueValidationFn } from "@/types/ValidationFns";
import { getTypeName } from "@/utils/getTypeName";
import { compNumber } from "./compNumber";

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

export const compInteger: SchemaComponent<number> = {
    getName(): string {
        return "type(integer)";
    },

    doSchemaActions(schema: OAS.Schema): void {
        schema.type = "integer";
    },

    *getTypeValidators(): Generator<TypeValidationFn<number>> {
        yield ensureIsNumber;
    },

    *getValueValidators(): Generator<ValueValidationFn<number>> {
        yield ensureIsInteger;
    },

    *getTypeValidationSummary(): Generator<string> {
        yield "an integer";
    },

    conflictsWith(other: SchemaComponent<number>): boolean {
        return other === this || other === compNumber;
    },

    tryResolveConflictWith(other: SchemaComponent<number>): SchemaComponent<number> | null {
        if (other === this) {
            return null;
        }

        return this;
    },
};
