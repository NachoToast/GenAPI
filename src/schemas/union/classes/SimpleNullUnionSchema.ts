import type { UnionTypeNode } from "typescript";
import { compNullable } from "@/schemas/base/components/compNullable";
import { IdentifiedSchemaObject } from "@/schemas/base/IdentifiedSchemaObject";
import { SchemaObject, type ToIdentifiedArgs } from "@/schemas/base/SchemaObject";

class IdentifiedSimpleNullUnionSchema extends IdentifiedSchemaObject {
    private readonly schema: IdentifiedSchemaObject;

    public constructor(
        args: ToIdentifiedArgs,
        previous: IdentifiedSimpleNullUnionSchema | null,
        schema: IdentifiedSchemaObject,
    ) {
        super(args, previous, ...schema.components, compNullable);
        this.schema = schema;
    }

    public override toIdentified(args: ToIdentifiedArgs): IdentifiedSchemaObject {
        return new IdentifiedSimpleNullUnionSchema(args, this, this.schema.toIdentified(args));
    }
}

export class SimpleNullUnionSchema extends SchemaObject {
    private readonly schema: SchemaObject;

    public constructor(node: UnionTypeNode, schema: SchemaObject) {
        super(node, ...schema.components, compNullable);
        this.schema = schema;
    }

    public override toIdentified(args: ToIdentifiedArgs): IdentifiedSchemaObject {
        return new IdentifiedSimpleNullUnionSchema(args, null, this.schema.toIdentified(args));
    }
}
