import type { PropertySignature } from "typescript";
import type { ReferenceDatabase } from "@/classes/ReferenceDatabase";
import { getJsDocTag } from "@/jsDoc/getJsDocTag";
import type { OAS } from "@/OAS";
import { StringValidator } from "@/validators/StringValidator";
import type { Validator } from "@/validators/Validator";
import { SchemaObject } from "../SchemaObject";

/**
 * ```ts
 * someKey: string
 * ```
 *
 * JSDoc:
 * - \@description
 * - \@example
 * - \@minLength
 * - \@maxLength
 */

export class PropertyStringKeywordSchema extends SchemaObject<string> {
    private readonly minLength: number | null;

    private readonly maxLength: number | null;

    public constructor(node: PropertySignature, refDb: ReferenceDatabase) {
        super({ node, type: "string", hasDescription: true, exampleFn: String }, refDb);

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
