import type { UnionTypeNode } from "typescript";
import { compNullable } from "@/schemas/base/components/compNullable";
import { IdentifiedSchemaObject } from "@/schemas/base/IdentifiedSchemaObject";
import { SchemaObject, type ToIdentifiedArgs } from "@/schemas/base/SchemaObject";

class IdentifiedSimpleNullUnionSchema extends IdentifiedSchemaObject<unknown> {
    private readonly schema: IdentifiedSchemaObject<unknown>;

    public constructor(
        args: ToIdentifiedArgs,
        previous: IdentifiedSimpleNullUnionSchema | null,
        schema: IdentifiedSchemaObject<unknown>,
    ) {
        super(args, previous, ...schema.components, compNullable);
        this.schema = schema;
    }

    public override toIdentified(args: ToIdentifiedArgs): IdentifiedSchemaObject<unknown> {
        return new IdentifiedSimpleNullUnionSchema(args, this, this.schema.toIdentified(args));
    }
}

export class SimpleNullUnionSchema extends SchemaObject<unknown> {
    private readonly schema: SchemaObject<unknown>;

    public constructor(node: UnionTypeNode, schema: SchemaObject<unknown>) {
        super(node, ...schema.components, compNullable);
        this.schema = schema;
    }

    public override toIdentified(args: ToIdentifiedArgs): IdentifiedSchemaObject<unknown> {
        return new IdentifiedSimpleNullUnionSchema(args, null, this.schema.toIdentified(args));
    }
}
