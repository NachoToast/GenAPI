import type { NumericLiteral } from "typescript";
import { SchemaObject } from "@/schemas/base/SchemaObject";
import { compInteger } from "../components/compInteger";
import { compNumber } from "../components/compNumber";
import { compNumberEnum } from "../components/compNumberEnum";

export class NumberLiteralSchema extends SchemaObject<number> {
    public constructor(node: NumericLiteral) {
        const value = Number(node.text);
        const isInteger = Number.isSafeInteger(value);
        super(node, [isInteger ? compInteger : compNumber, compNumberEnum(value)]);
    }
}
