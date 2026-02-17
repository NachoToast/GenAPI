import type { Node } from "typescript";
import { ValidationError } from "@/errors/ValidationError";
import { getJsDocTag } from "@/jsDoc/getJsDocTag";
import type { OAS } from "@/OAS";
import type { SchemaComponent } from "@/schemas/base/SchemaComponent";
import type { ValueValidationFn } from "@/types/ValidationFns";

function ensureIsNotLessThan(min: number): ValueValidationFn<number> {
    const message = `Cannot be less than ${min}`;

    return (input: number) => {
        if (input < min) {
            throw new ValidationError(message);
        }
    };
}

/**
 * Sets the schema `minimum` field to the JSDoc **@min** tag value and validates number inputs
 * against it.
 */
class CompMinimum implements SchemaComponent<number> {
    private readonly minimum: number;

    public constructor(minimum: number) {
        this.minimum = minimum;
    }

    public doSchemaActions(schema: OAS.Schema): void {
        schema.minimum = this.minimum;
    }

    public *getValueValidators(): Generator<ValueValidationFn<number>> {
        yield ensureIsNotLessThan(this.minimum);
    }

    public doCopyFrom(other: SchemaComponent<number>): void {
        if (other instanceof CompMinimum) {
            throw new Error("JSDoc min tag cannot be defined in multiple places");
        }
    }
}

export function compMinimum(node: Node, isInteger: boolean): CompMinimum | null {
    const minimum = getJsDocTag(node, "min", (x) => (isInteger ? x.integer() : x.number()));

    if (minimum !== null) {
        return new CompMinimum(minimum);
    }

    return null;
}
