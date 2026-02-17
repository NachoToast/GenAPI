import type { Node } from "typescript";
import { ValidationError } from "@/errors/ValidationError";
import { getJsDocTag } from "@/jsDoc/getJsDocTag";
import type { OAS } from "@/OAS";
import type { SchemaComponent } from "@/schemas/base/SchemaComponent";
import type { ValueValidationFn } from "@/types/ValidationFns";

function ensureIsNotLongerThan(max: number): ValueValidationFn<string> {
    const characters = max === 1 ? "character" : "characters";
    const message = `Cannot be greater than ${max} ${characters} long`;

    return (input: string) => {
        if (input.length > max) {
            throw new ValidationError(message);
        }
    };
}

/**
 * Sets the schema `maxLength` field to the JSDoc **@maxLength** tag value and validates string
 * inputs against it.
 */
class CompMaxLength implements SchemaComponent<string> {
    private readonly maxLength: number;

    public constructor(maxLength: number) {
        this.maxLength = maxLength;
    }

    public doSchemaActions(schema: OAS.Schema): void {
        schema.maxLength = this.maxLength;
    }

    public *getValueValidators(): Generator<ValueValidationFn<string>> {
        yield ensureIsNotLongerThan(this.maxLength);
    }

    public doCopyFrom(other: SchemaComponent<string>): void {
        if (other instanceof CompMaxLength) {
            throw new Error("JSDoc maxLength tag cannot be defined in multiple places");
        }
    }
}

export function compMaxLength(node: Node): CompMaxLength | null {
    const maxLength = getJsDocTag(node, "maxLength", (x) => x.integer().min(0));

    if (maxLength !== null) {
        return new CompMaxLength(maxLength);
    }

    return null;
}
