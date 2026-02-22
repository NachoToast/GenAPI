import type { Node } from "typescript";
import { SchemaObject } from "@/schemas/base/SchemaObject";
import { compNull } from "../components/compNull";

export class NullKeywordSchema extends SchemaObject<null> {
    public constructor(node: Node) {
        super(node, [compNull]);
    }
}
