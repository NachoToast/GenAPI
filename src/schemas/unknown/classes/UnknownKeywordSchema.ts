import type { Node } from "typescript";
import { SchemaObject } from "@/schemas/base/SchemaObject";
import { compUnknown } from "../components/compUnknown";

export class UnknownKeywordSchema extends SchemaObject<unknown> {
    public constructor(node: Node) {
        super(node, [compUnknown]);
    }
}
