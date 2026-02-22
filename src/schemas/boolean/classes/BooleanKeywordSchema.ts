import type { Node } from "typescript";
import { NamedSchemaObject, type NamedSchemaObjectArgs } from "@/schemas/base/NamedSchemaObject";
import type { SchemaComponent } from "@/schemas/base/SchemaComponent";
import { SchemaObject } from "@/schemas/base/SchemaObject";
import { compBoolean } from "../components/compBoolean";
import { compBooleanExample } from "../components/compBooleanExample";

class NamedBooleanKeywordSchema extends NamedSchemaObject<boolean> {
    protected override *getExtraComponents(node: Node): Generator<SchemaComponent<boolean> | null> {
        yield* super.getExtraComponents(node);
        yield compBooleanExample(node);
    }
}

export class BooleanKeywordSchema extends SchemaObject<boolean> {
    public constructor(node: Node) {
        super(node, [compBoolean]);
    }

    public override toNamed(args: NamedSchemaObjectArgs): NamedSchemaObject<boolean> {
        return new NamedBooleanKeywordSchema(args, [...this.components]);
    }
}
