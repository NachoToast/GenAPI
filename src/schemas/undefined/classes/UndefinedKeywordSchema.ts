import type { Node } from "typescript";
import { IdentifiedSchemaObject } from "@/schemas/base/IdentifiedSchemaObject";
import { SchemaObject, type ToIdentifiedArgs } from "@/schemas/base/SchemaObject";
import { compUndefined } from "../components/compUndefined";

class IdentifiedUndefinedKeywordSchema extends IdentifiedSchemaObject<undefined> {
    public constructor(args: ToIdentifiedArgs, previous: IdentifiedUndefinedKeywordSchema | null) {
        super(args, previous, compUndefined);
    }

    public override toIdentified(args: ToIdentifiedArgs): IdentifiedSchemaObject<undefined> {
        return new IdentifiedUndefinedKeywordSchema(args, this);
    }
}

export class UndefinedKeywordSchema extends SchemaObject<undefined> {
    public constructor(node: Node) {
        super(node, compUndefined);
    }

    public override toIdentified(args: ToIdentifiedArgs): IdentifiedSchemaObject<undefined> {
        return new IdentifiedUndefinedKeywordSchema(args, null);
    }
}
