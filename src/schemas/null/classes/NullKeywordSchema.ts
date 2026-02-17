import type { Node } from "typescript";
import { IdentifiedSchemaObject } from "@/schemas/base/IdentifiedSchemaObject";
import { SchemaObject, type ToIdentifiedArgs } from "@/schemas/base/SchemaObject";
import { compNull } from "../components/compNull";

export class IdentifiedNullKeywordSchema extends IdentifiedSchemaObject<null> {
    public constructor(args: ToIdentifiedArgs, previous: IdentifiedNullKeywordSchema | null) {
        super(args, previous, compNull);
    }

    public override toIdentified(args: ToIdentifiedArgs): IdentifiedSchemaObject<null> {
        return new IdentifiedNullKeywordSchema(args, this);
    }
}

export class NullKeywordSchema extends SchemaObject<null> {
    public constructor(node: Node) {
        super(node, compNull);
    }

    public override toIdentified(args: ToIdentifiedArgs): IdentifiedSchemaObject<null> {
        return new IdentifiedNullKeywordSchema(args, null);
    }
}
