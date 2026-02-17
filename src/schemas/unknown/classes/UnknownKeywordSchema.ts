import type { Node } from "typescript";
import { IdentifiedSchemaObject } from "@/schemas/base/IdentifiedSchemaObject";
import { SchemaObject, type ToIdentifiedArgs } from "@/schemas/base/SchemaObject";
import { compUnknown } from "../components/compUnknown";

export class IdentifiedUnknownKeywordSchema extends IdentifiedSchemaObject<unknown> {
    public constructor(args: ToIdentifiedArgs, previous: IdentifiedUnknownKeywordSchema | null) {
        super(args, previous, compUnknown);
    }

    public override toIdentified(args: ToIdentifiedArgs): IdentifiedSchemaObject<unknown> {
        return new IdentifiedUnknownKeywordSchema(args, this);
    }
}

export class UnknownKeywordSchema extends SchemaObject<unknown> {
    public constructor(node: Node) {
        super(node, compUnknown);
    }

    public override toIdentified(args: ToIdentifiedArgs): IdentifiedSchemaObject<unknown> {
        return new IdentifiedUnknownKeywordSchema(args, null);
    }
}
