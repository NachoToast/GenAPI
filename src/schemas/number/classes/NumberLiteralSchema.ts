import type { NumericLiteral } from "typescript";
import { IdentifiedSchemaObject } from "@/schemas/base/IdentifiedSchemaObject";
import { SchemaObject, type ToIdentifiedArgs } from "@/schemas/base/SchemaObject";
import { compInteger } from "../components/compInteger";
import { compNumber } from "../components/compNumber";
import { compNumberEnum } from "../components/compStringEnum";

class IdentifiedNumberLiteralSchema extends IdentifiedSchemaObject<number> {
    private readonly value: number;

    private readonly isInteger: boolean;

    public constructor(
        args: ToIdentifiedArgs,
        previous: IdentifiedNumberLiteralSchema | null,
        value: number,
        isInteger: boolean,
    ) {
        super(args, previous, isInteger ? compInteger : compNumber, compNumberEnum([value]));
        this.value = value;
        this.isInteger = isInteger;
    }

    public override toIdentified(args: ToIdentifiedArgs): IdentifiedSchemaObject<number> {
        return new IdentifiedNumberLiteralSchema(args, this, this.value, this.isInteger);
    }
}

export class NumberLiteralSchema extends SchemaObject<number> {
    private readonly value: number;

    private readonly isInteger: boolean;

    public constructor(node: NumericLiteral) {
        const value = Number(node.text);
        const isInteger = Number.isSafeInteger(value);

        super(node, isInteger ? compInteger : compNumber, compNumberEnum([value]));

        this.value = value;
        this.isInteger = isInteger;
    }

    public override toIdentified(args: ToIdentifiedArgs): IdentifiedSchemaObject<number> {
        return new IdentifiedNumberLiteralSchema(args, null, this.value, this.isInteger);
    }
}
