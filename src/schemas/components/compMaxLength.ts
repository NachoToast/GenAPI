import type { Node } from "typescript";
import { ParserError } from "@/errors/ParserError";
import { ValidationError } from "@/errors/ValidationError";
import { getJsDocTag } from "@/jsDoc/getJsDocTag";
import type { OAS } from "@/OAS";
import type { SchemaComponent } from "@/schemas/base/SchemaComponent";
import type { ValidationFn } from "@/types/ValidationFns";

function getMaxLength(node: Node): number | null {
    return getJsDocTag(node, "maxLength", (x) => x.integer().min(0));
}

function ensureIsNotLongerThan(max: number): ValidationFn<string> {
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

    public copyToIdentified(node: Node): SchemaComponent<string> {
        const maxLength = getMaxLength(node);

        if (maxLength !== null) {
            throw new ParserError(
                node,
                "JSDoc maxLength tag is defined in multiple places, unsure which one to use",
            );
        }

        return this;
    }

    public doSchemaActions(schema: OAS.Schema): void {
        schema.maxLength = this.maxLength;
    }

    public *getExtraValidators(): Generator<ValidationFn<string>> {
        yield ensureIsNotLongerThan(this.maxLength);
    }
}

export const compMaxLength: SchemaComponent<string> = {
    copyToIdentified(node: Node): SchemaComponent<string> {
        const maxLength = getMaxLength(node);

        if (maxLength !== null) {
            return new CompMaxLength(maxLength);
        }

        return this;
    },
};
