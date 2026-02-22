import type { Node } from "typescript";
import { NamedSchemaObject, type NamedSchemaObjectArgs } from "@/schemas/base/NamedSchemaObject";
import type { SchemaComponent } from "@/schemas/base/SchemaComponent";
import { SchemaObject } from "@/schemas/base/SchemaObject";
import { compMaxLength } from "../components/compMaxLength";
import { compMinLength } from "../components/compMinLength";
import { compString } from "../components/compString";
import { compStringExample } from "../components/compStringExample";

class NamedStringKeywordSchema extends NamedSchemaObject<string> {
    protected override *getExtraComponents(node: Node): Generator<SchemaComponent<string> | null> {
        yield* super.getExtraComponents(node);
        yield compStringExample(node);
        yield compMinLength(node);
        yield compMaxLength(node);
    }
}

export class StringKeywordSchema extends SchemaObject<string> {
    public constructor(node: Node) {
        super(node, [compString]);
    }

    public override toNamed(args: NamedSchemaObjectArgs): NamedSchemaObject<string> {
        return new NamedStringKeywordSchema(args, [...this.components]);
    }
}
