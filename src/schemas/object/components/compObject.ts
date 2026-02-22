import { ValidationError } from "@/errors/ValidationError";
import type { OAS } from "@/OAS";
import type { SchemaComponent } from "@/schemas/base/SchemaComponent";
import type { AnyObject } from "@/types/AnyObject";
import type { TypeValidationFn, ValueValidationFn } from "@/types/ValidationFns";
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

export const compObject: SchemaComponent<AnyObject> = {
    getName(): string {
        return "type(object)";
    },

    doSchemaActions(schema: OAS.Schema): void {
        schema.type = "object";
        schema.additionalProperties = false;
    },

    *getTypeValidators(): Generator<TypeValidationFn<AnyObject>> {
        yield ensureIsObject;
    },

    *getValueValidators(): Generator<ValueValidationFn<AnyObject>> {
        yield ensureIsValidObject;
    },

    *getTypeValidationSummary(): Generator<string> {
        yield "an object";
    },

    conflictsWith(other: SchemaComponent<AnyObject>): boolean {
        return other === this;
    },
};
