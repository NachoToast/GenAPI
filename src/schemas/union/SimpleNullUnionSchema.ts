import type { UnionTypeNode } from "typescript";
import { compNullable } from "@/schemas/base/components/compNullable";
import type { NamedSchemaObject, NamedSchemaObjectArgs } from "../base/NamedSchemaObject";
import { type AnySchemaObject, SchemaObject } from "../base/SchemaObject";

export class SimpleNullUnionSchema extends SchemaObject<unknown> {
    private readonly schema: AnySchemaObject;

    public constructor(node: UnionTypeNode, schema: AnySchemaObject) {
        super(node, [...schema.components, compNullable]);
        this.schema = schema;
    }

    public override toNamed(args: NamedSchemaObjectArgs): NamedSchemaObject<unknown> {
        const output = this.schema.toNamed(args);
        output.addComponent(compNullable);
        return output;
    }

    protected override *getLongStringParts(): Generator<string> {
        yield* super.getLongStringParts();
        yield `Schema: ${this.schema.toStringShort()}`;
    }
}
