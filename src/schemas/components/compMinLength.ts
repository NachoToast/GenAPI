import type { Node } from "typescript";
import { ParserError } from "@/errors/ParserError";
import { ValidationError } from "@/errors/ValidationError";
import { getJsDocTag } from "@/jsDoc/getJsDocTag";
import type { OAS } from "@/OAS";
import type { SchemaComponent } from "@/schemas/base/SchemaComponent";
import type { ValidationFn } from "@/types/ValidationFns";

function getMinLength(node: Node): number | null {
    // minimum of 1, since allowing 0-length strings can be done by simply omitting the tag
    return getJsDocTag(node, "minLength", (x) => x.integer().min(1));
}

function ensureIsNotShorterThan(min: number): ValidationFn<string> {
    const characters = min === 1 ? "character" : "characters";
    const message = `Cannot be less than ${min} ${characters} long`;

    return (input: string) => {
        if (input.length < min) {
            throw new ValidationError(message);
        }
    };
}

/**
 * Sets the schema `minLength` field to the JSDoc **@minLength** tag value and validates string
 * inputs against it.
 */
class CompMinLength implements SchemaComponent<string> {
    private readonly minLength: number;

    public constructor(minLength: number) {
        this.minLength = minLength;
    }

    public copyToIdentified(node: Node): SchemaComponent<string> {
        const minLength = getMinLength(node);

        if (minLength !== null) {
            throw new ParserError(
                node,
                "JSDoc minLength tag is defined in multiple places, unsure which one to use",
            );
        }

        return this;
    }

    public doSchemaActions(schema: OAS.Schema): void {
        schema.minLength = this.minLength;
    }

    public *getExtraValidators(): Generator<ValidationFn<string>> {
        yield ensureIsNotShorterThan(this.minLength);
    }
}

export const compMinLength: SchemaComponent<string> = {
    copyToIdentified(node: Node): SchemaComponent<string> {
        const minLength = getMinLength(node);

        if (minLength !== null) {
            return new CompMinLength(minLength);
        }

        return this;
    },
};
