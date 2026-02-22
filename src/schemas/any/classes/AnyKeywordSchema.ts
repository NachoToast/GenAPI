import type { Node } from "typescript";
import { SchemaObject } from "@/schemas/base/SchemaObject";
import { compAny } from "../components/compAny";

export class AnyKeywordSchema extends SchemaObject<unknown> {
    public constructor(node: Node) {
        super(node, [compAny]);
    }
}
