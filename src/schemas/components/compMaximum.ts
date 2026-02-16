import type { Node } from "typescript";
import { ParserError } from "@/errors/ParserError";
import { ValidationError } from "@/errors/ValidationError";
import { getJsDocTag } from "@/jsDoc/getJsDocTag";
import type { OAS } from "@/OAS";
import type { SchemaComponent } from "@/schemas/base/SchemaComponent";
import type { ValidationFn } from "@/types/ValidationFns";

function getMax(node: Node): number | null {
    return getJsDocTag(node, "max", (x) => x.number());
}

function ensureIsNotGreaterThan(max: number): ValidationFn<number> {
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
class CompMaxValue implements SchemaComponent<number> {
    private readonly max: number;

    public constructor(max: number) {
        this.max = max;
    }

    public copyToIdentified(node: Node): SchemaComponent<number> {
        const max = getMax(node);

        if (max !== null) {
            throw new ParserError(
                node,
                "JSDoc max tag is defined in multiple places, unsure which one to use",
            );
        }

        return this;
    }

    public doSchemaActions(schema: OAS.Schema): void {
        schema.maximum = this.max;
    }

    public *getExtraValidators(): Generator<ValidationFn<number>> {
        yield ensureIsNotGreaterThan(this.max);
    }
}

export const compMaximum: SchemaComponent<number> = {
    copyToIdentified(node: Node): SchemaComponent<number> {
        const max = getMax(node);

        if (max !== null) {
            return new CompMaxValue(max);
        }

        return this;
    },
};
