import type { Node } from "typescript";
import { IdentifiedSchemaObject } from "@/schemas/base/IdentifiedSchemaObject";
import { SchemaObject, type ToIdentifiedArgs } from "@/schemas/base/SchemaObject";
import { compMaxLength } from "../components/compMaxLength";
import { compMinLength } from "../components/compMinLength";
import { compString } from "../components/compString";
import { compStringExample } from "../components/compStringExample";

class IdentifiedStringKeywordSchema extends IdentifiedSchemaObject<string> {
    public constructor(args: ToIdentifiedArgs, previous: IdentifiedStringKeywordSchema | null) {
        const { node } = args;

        super(
            args,
            previous,
            compString,
            compStringExample(node),
            compMinLength(node),
            compMaxLength(node),
        );
    }

    public override toIdentified(args: ToIdentifiedArgs): IdentifiedSchemaObject<string> {
        return new IdentifiedStringKeywordSchema(args, this);
    }
}

export class StringKeywordSchema extends SchemaObject<string> {
    public constructor(node: Node) {
        super(node, compString);
    }

    public override toIdentified(args: ToIdentifiedArgs): IdentifiedSchemaObject<string> {
        return new IdentifiedStringKeywordSchema(args, null);
    }
}
