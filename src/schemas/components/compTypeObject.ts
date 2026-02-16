import { ValidationError } from "@/errors/ValidationError";
import type { OAS } from "@/OAS";
import type { SchemaComponent } from "@/schemas/base/SchemaComponent";
import type { AnyObject } from "@/types/AnyObject";
import type { TypeValidationFn, ValidationFn } from "@/types/ValidationFns";
import { getTypeName } from "@/utils/getTypeName";

function ensureIsObject(input: unknown): asserts input is AnyObject {
    const type = typeof input;

    if (type !== "object") {
        throw new ValidationError(`Expected an object but got ${getTypeName(type)}`);
    }
}

function ensureIsValidObject(input: object): void {
    if (input === null) {
        throw new ValidationError("Cannot be null");
    }
}

/** Sets the schema `type` field to "object" and validates input types accordingly. */
export const compTypeObject: SchemaComponent<AnyObject> = {
    copyToIdentified(): SchemaComponent<AnyObject> {
        return this;
    },

    doSchemaActions(schema: OAS.Schema): void {
        schema.type = "object";
        schema.additionalProperties = false;
    },

    *getTypeValidators(): Generator<TypeValidationFn<AnyObject>> {
        yield ensureIsObject;
    },

    *getExtraValidators(): Generator<ValidationFn<AnyObject>> {
        yield ensureIsValidObject;
    },

    *getValidationSummary(): Generator<string> {
        yield "an object";
    },
};
