import type { Node } from "typescript";
import { SchemaObject } from "@/schemas/base/SchemaObject";
import { compBoolean } from "../components/compBoolean";
import { compBooleanEnum } from "../components/compBooleanEnum";

export class BooleanLiteralSchema extends SchemaObject<boolean> {
    public constructor(node: Node, value: boolean) {
        super(node, [compBoolean, compBooleanEnum(value)]);
    }
}
