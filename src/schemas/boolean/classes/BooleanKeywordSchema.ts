import type { Node } from "typescript";
import { IdentifiedSchemaObject } from "@/schemas/base/IdentifiedSchemaObject";
import { SchemaObject, type ToIdentifiedArgs } from "@/schemas/base/SchemaObject";
import { compBoolean } from "../components/compBoolean";
import { compBooleanExample } from "../components/compBooleanExample";

class IdentifiedBooleanKeywordSchema extends IdentifiedSchemaObject<boolean> {
    public constructor(args: ToIdentifiedArgs, previous: IdentifiedBooleanKeywordSchema | null) {
        const { node } = args;

        super(args, previous, compBoolean, compBooleanExample(node));
    }

    public override toIdentified(args: ToIdentifiedArgs): IdentifiedSchemaObject<boolean> {
        return new IdentifiedBooleanKeywordSchema(args, this);
    }
}

export class BooleanKeywordSchema extends SchemaObject<boolean> {
    public constructor(node: Node) {
        super(node, compBoolean);
    }

    public override toIdentified(args: ToIdentifiedArgs): IdentifiedSchemaObject<boolean> {
        return new IdentifiedBooleanKeywordSchema(args, null);
    }
}
