import type { TypeAliasDeclaration } from "typescript";
import type { ReferenceDatabase } from "@/classes/ReferenceDatabase";
import { getJsDocTag } from "@/helpers/jsDoc/getJsDocTag";
import type { OAS } from "@/OAS";
import { StringValidator } from "@/validators/String";
import type { Validator } from "@/validators/Validator";
import { NamedSchemaObject } from "../NamedSchemaObject";

/**
 * ```ts
 * type SomeString = string
 * ```
 *
 * JSDoc:
 * - \@description
 * - \@example
 * - \@minLength
 * - \@maxLength
 */
export class AliasedStringKeywordSchema extends NamedSchemaObject<string> {
    private readonly minLength: number | null;

    private readonly maxLength: number | null;

    public constructor(node: TypeAliasDeclaration, refDb: ReferenceDatabase) {
        super({ node, type: "string", hasDescription: true, exampleFn: String }, refDb, node.name);

        this.minLength = getJsDocTag(node, "minLength", (x) => x.integer().min(0));
        this.maxLength = getJsDocTag(node, "maxLength", (x) => x.integer().min(0));
    }

    public override makeValidator(): Validator {
        return new StringValidator().setMinLength(this.minLength).setMaxLength(this.maxLength);
    }

    public override toSchema(): OAS.Schema {
        const output: OAS.Schema = super.toSchema();

        if (this.minLength !== null) {
            output.minLength = this.minLength;
        }

        if (this.maxLength !== null) {
            output.maxLength = this.maxLength;
        }

        return output;
    }
}
