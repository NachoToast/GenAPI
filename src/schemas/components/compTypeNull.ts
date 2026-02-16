import { ValidationError } from "@/errors/ValidationError";
import type { OAS } from "@/OAS";
import type { SchemaComponent } from "@/schemas/base/SchemaComponent";
import type { TypeValidationFn } from "@/types/ValidationFns";
import { getTypeName } from "@/utils/getTypeName";
import { SchemaFlag } from "../base/SchemaFlag";

function ensureIsNull(input: unknown): asserts input is null {
    if (input !== null) {
        throw new ValidationError(`Expected null but got ${getTypeName(typeof input)}`);
    }
}

/**
 * Signifies the schema as representing a `null` literal and validates inputs against `null`.
 *
 * This is distinct from `compNullable` in the sense that it represents null itself, while
 * `compNullable` represents a value that can be null, e.g:
 *
 * ```ts
 * type MyFirstType = string | null; // compNullable
 * type MySecondType = null; // compTypeNull
 * ```
 *
 * As a side note, does the word "nullable" look really weird or have I just been typing it out for
 * too long.
 */
export const compTypeNull: SchemaComponent<null> = {
    copyToIdentified(): SchemaComponent<null> {
        return this;
    },

    *getFlags(): Generator<SchemaFlag> {
        yield SchemaFlag.CanDoSimpleNullableUnions;
    },

    doSchemaActions(schema: OAS.Schema): void {
        schema.description ??= "Represents the `null` type.";
        schema.nullable = true;
    },

    *getTypeValidators(): Generator<TypeValidationFn<null>> {
        yield ensureIsNull;
    },

    *getValidationSummary(): Generator<string> {
        yield "null";
    },
};
