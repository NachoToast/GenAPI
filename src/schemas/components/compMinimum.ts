import type { Node } from "typescript";
import { ParserError } from "@/errors/ParserError";
import { ValidationError } from "@/errors/ValidationError";
import { getJsDocTag } from "@/jsDoc/getJsDocTag";
import type { OAS } from "@/OAS";
import type { SchemaComponent } from "@/schemas/base/SchemaComponent";
import type { ValidationFn } from "@/types/ValidationFns";

function getMin(node: Node): number | null {
    return getJsDocTag(node, "min", (x) => x.number());
}

function ensureIsNotLessThan(min: number): ValidationFn<number> {
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
    private readonly min: number;

    public constructor(min: number) {
        this.min = min;
    }

    public copyToIdentified(node: Node): SchemaComponent<number> {
        const min = getMin(node);

        if (min !== null) {
            throw new ParserError(
                node,
                "JSDoc min tag is defined in multiple places, unsure which one to use",
            );
        }

        return this;
    }

    public doSchemaActions(schema: OAS.Schema): void {
        schema.minimum = this.min;
    }

    public *getExtraValidators(): Generator<ValidationFn<number>> {
        yield ensureIsNotLessThan(this.min);
    }
}

export const compMinimum: SchemaComponent<number> = {
    copyToIdentified(node: Node): SchemaComponent<number> {
        const min = getMin(node);

        if (min !== null) {
            return new CompMinimum(min);
        }

        return this;
    },
};
