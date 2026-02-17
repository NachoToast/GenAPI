/** biome-ignore-all lint/suspicious/noExplicitAny: consumer's fault, not mine */

import type { Node } from "typescript";
import { IdentifiedSchemaObject } from "@/schemas/base/IdentifiedSchemaObject";
import { SchemaObject, type ToIdentifiedArgs } from "@/schemas/base/SchemaObject";
import { compAny } from "../components/compAny";

export class IdentifiedAnyKeywordSchema extends IdentifiedSchemaObject {
    public constructor(args: ToIdentifiedArgs, previous: IdentifiedAnyKeywordSchema | null) {
        super(args, previous, compAny);
    }

    public override toIdentified(args: ToIdentifiedArgs): IdentifiedSchemaObject {
        return new IdentifiedAnyKeywordSchema(args, this);
    }
}

export class AnyKeywordSchema extends SchemaObject {
    public constructor(node: Node) {
        super(node, compAny);
    }

    public override toIdentified(args: ToIdentifiedArgs): IdentifiedSchemaObject {
        return new IdentifiedAnyKeywordSchema(args, null);
    }
}
