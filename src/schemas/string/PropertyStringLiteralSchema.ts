import type { PropertySignature } from "typescript";
import type { ReferenceDatabase } from "@/classes/ReferenceDatabase";
import type { OAS } from "@/OAS";
import { StringValidator } from "@/validators/StringValidator";
import type { Validator } from "@/validators/Validator";
import { SchemaObject } from "../SchemaObject";

/**
 * ```ts
 * someKey: "blah blah blah"
 * ```
 *
 * JSDoc:
 * - \@description
 */

export class PropertyStringLiteralSchema extends SchemaObject<string> {
    private readonly fixedValues: string[];

    public constructor(
        node: PropertySignature,
        refDb: ReferenceDatabase,
        ...fixedValues: string[]
    ) {
        super({ node, type: "string", hasDescription: true, exampleFn: null }, refDb);
        this.fixedValues = fixedValues;
    }

    public override makeValidator(): Validator {
        return new StringValidator().setEnum(this.fixedValues);
    }

    public override toSchema(): OAS.Schema {
        const output: OAS.Schema = super.toSchema();

        output.enum = this.fixedValues;

        return output;
    }
}
