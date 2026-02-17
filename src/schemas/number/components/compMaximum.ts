import type { Node } from "typescript";
import { ValidationError } from "@/errors/ValidationError";
import { getJsDocTag } from "@/jsDoc/getJsDocTag";
import type { OAS } from "@/OAS";
import type { SchemaComponent } from "@/schemas/base/SchemaComponent";
import type { ValueValidationFn } from "@/types/ValidationFns";

function ensureIsNotGreaterThan(max: number): ValueValidationFn<number> {
    const message = `Cannot be greater than ${max}`;

    return (input: number) => {
        if (input > max) {
            throw new ValidationError(message);
        }
    };
}

/**
 * Sets the schema `maximum` field to the JSDoc **@max** tag value and validates number inputs
 * against it.
 */
class CompMaximum implements SchemaComponent<number> {
    private readonly maximum: number;

    public constructor(maximum: number) {
        this.maximum = maximum;
    }

    public doSchemaActions(schema: OAS.Schema): void {
        schema.maximum = this.maximum;
    }

    public *getValueValidators(): Generator<ValueValidationFn<number>> {
        yield ensureIsNotGreaterThan(this.maximum);
    }

    public doCopyFrom(other: SchemaComponent<number>): void {
        if (other instanceof CompMaximum) {
            throw new Error("JSDoc max tag cannot be defined in multiple places");
        }
    }
}

export function compMaximum(node: Node, isInteger: boolean): CompMaximum | null {
    const maximum = getJsDocTag(node, "max", (x) => (isInteger ? x.integer() : x.number()));

    if (maximum !== null) {
        return new CompMaximum(maximum);
    }

    return null;
}
