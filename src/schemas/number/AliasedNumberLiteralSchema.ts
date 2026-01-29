import type { TypeAliasDeclaration } from "typescript";
import type { ReferenceDatabase } from "@/classes/ReferenceDatabase";
import type { OAS } from "@/OAS";
import { NumberValidator } from "@/validators/Number";
import type { Validator } from "@/validators/Validator";
import { NamedSchemaObject } from "../NamedSchemaObject";
import type { SchemaType } from "../SchemaObject";

/**
 * ```ts
 * type SomeNumber = 12345
 * ```
 *
 * JSDoc:
 * - \@description
 */
export class AliasedNumberLiteralSchema extends NamedSchemaObject<number> {
    private readonly isInteger: boolean;

    private readonly fixedValues: number[];

    public constructor(
        node: TypeAliasDeclaration,
        refDb: ReferenceDatabase,
        ...fixedValues: number[]
    ) {
        const isInteger = fixedValues.every((x) => Number.isInteger(x));

        const type: SchemaType = isInteger ? "integer" : "number";

        super({ node, type, hasDescription: true, exampleFn: null }, refDb, node.name);

        this.isInteger = isInteger;
        this.fixedValues = fixedValues;
    }

    public override makeValidator(): Validator {
        return new NumberValidator(this.isInteger).setEnum(this.fixedValues);
    }

    public override toSchema(): OAS.Schema {
        const output: OAS.Schema = super.toSchema();

        output.enum = this.fixedValues;

        return output;
    }
}
