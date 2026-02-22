import { ValidationError } from "@/errors/ValidationError";
import type { OAS } from "@/OAS";
import type { SchemaComponent } from "@/schemas/base/SchemaComponent";
import type { TypeValidationFn } from "@/types/ValidationFns";
import { getTypeName } from "@/utils/getTypeName";

function ensureIsNull(input: unknown): asserts input is null {
    if (input !== null) {
        throw new ValidationError(`Expected null but got ${getTypeName(typeof input)}`);
    }
}

/**
 * Signifies the schema as representing a `null` literal and validates inputs against `null`.
 *
 * This is distinct from `compNullable` in the sense that it represents null itself, while
 * `compNullable` represents another value that can be null, e.g:
 *
 * ```ts
 * type MyFirstType = string | null; // compNullable
 * type MySecondType = null; // compNull
 * ```
 */
export const compNull: SchemaComponent<null> = {
    getName(): string {
        return "type(null)";
    },

    doSchemaActions(schema: OAS.Schema): void {
        schema.description ??= "Represents the `null` type.";
        schema.nullable = true;
    },

    *getTypeValidators(): Generator<TypeValidationFn<null>> {
        yield ensureIsNull;
    },

    *getTypeValidationSummary(): Generator<string> {
        yield "null";
    },

    conflictsWith(other: SchemaComponent<null>): boolean {
        return other === this;
    },
};
