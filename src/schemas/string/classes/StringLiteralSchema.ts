import type { StringLiteral } from "typescript";
import { NamedSchemaObject, type NamedSchemaObjectArgs } from "@/schemas/base/NamedSchemaObject";
import { SchemaObject } from "@/schemas/base/SchemaObject";
import { compString } from "../components/compString";
import { compStringEnum } from "../components/compStringEnum";

export class StringLiteralSchema extends SchemaObject<string> {
    public constructor(node: StringLiteral) {
        super(node, [compString, compStringEnum(node.text)]);
    }

    public override toNamed(args: NamedSchemaObjectArgs): NamedSchemaObject<string> {
        return new NamedSchemaObject(args, [...this.components]);
    }
}
