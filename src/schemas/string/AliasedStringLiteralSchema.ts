import type { TypeAliasDeclaration } from "typescript";
import type { ReferenceDatabase } from "@/classes/ReferenceDatabase";
import type { OAS } from "@/OAS";
import { StringValidator } from "@/validators/String";
import type { Validator } from "@/validators/Validator";
import { NamedSchemaObject } from "../NamedSchemaObject";

/**
 * ```ts
 * type SomeString = "blah blah blah"
 * ```
 *
 * JSDoc:
 * - \@description
 */
export class AliasedStringLiteralSchema extends NamedSchemaObject<string> {
    private readonly fixedValues: string[];

    public constructor(
        node: TypeAliasDeclaration,
        refDb: ReferenceDatabase,
        ...fixedValues: string[]
    ) {
        super({ node, type: "string", hasDescription: true, exampleFn: null }, refDb, node.name);
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
