import type { TypeAliasDeclaration } from "typescript";
import type { ReferenceDatabase } from "@/classes/ReferenceDatabase";
import { getJsDocTag } from "@/helpers/jsDoc/getJsDocTag";
import type { OAS } from "@/OAS";
import { NumberValidator } from "@/validators/Number";
import type { Validator } from "@/validators/Validator";
import { NamedSchemaObject } from "../NamedSchemaObject";
import type { SchemaType } from "../SchemaObject";

/**
 * ```ts
 * type SomeNumber = number
 * ```
 *
 * JSDoc:
 * - \@description
 * - \@example
 * - \@min
 * - \@max
 * - \@integer
 */
export class AliasedNumberKeywordSchema extends NamedSchemaObject<number> {
    private readonly isInteger: boolean;

    private readonly min: number | null;

    private readonly max: number | null;

    public constructor(node: TypeAliasDeclaration, refDb: ReferenceDatabase) {
        const isInteger = getJsDocTag(node, "integer", (x) => x.string()) !== null;

        const type: SchemaType = isInteger ? "integer" : "number";

        super({ node, type, hasDescription: true, exampleFn: Number }, refDb, node.name);

        if (isInteger) {
            this.isInteger = true;
            this.min = getJsDocTag(node, "min", (x) => x.integer());
            this.max = getJsDocTag(node, "max", (x) => x.integer());
        } else {
            this.isInteger = false;
            this.min = getJsDocTag(node, "min", (x) => x.number());
            this.max = getJsDocTag(node, "max", (x) => x.number());
        }
    }

    public override makeValidator(): Validator {
        return new NumberValidator(this.isInteger).setMin(this.min).setMax(this.max);
    }

    public override toSchema(): OAS.Schema {
        const output: OAS.Schema = super.toSchema();

        if (this.min !== null) {
            output.minimum = this.min;
        }

        if (this.max !== null) {
            output.maximum = this.max;
        }

        return output;
    }
}
