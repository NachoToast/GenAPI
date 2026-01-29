import type { PropertySignature } from "typescript";
import type { ReferenceDatabase } from "@/classes/ReferenceDatabase";
import type { OAS } from "@/OAS";
import { NumberValidator } from "@/validators/Number";
import type { Validator } from "@/validators/Validator";
import { SchemaObject, type SchemaType } from "../SchemaObject";

/**
 * ```ts
 * someKey: 12345
 * ```
 *
 * JSDoc:
 * - \@description
 */
export class PropertyNumberLiteralSchema extends SchemaObject<number> {
    private readonly isInteger: boolean;

    private readonly fixedValues: number[];

    public constructor(
        node: PropertySignature,
        refDb: ReferenceDatabase,
        ...fixedValues: number[]
    ) {
        const isInteger = fixedValues.every((x) => Number.isInteger(x));

        const type: SchemaType = isInteger ? "integer" : "number";

        super({ node, type, hasDescription: true, exampleFn: null }, refDb);

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
