import type { Node } from "typescript";
import { SchemaObject } from "@/schemas/base/SchemaObject";
import { compUndefined } from "../components/compUndefined";

export class UndefinedKeywordSchema extends SchemaObject<undefined> {
    public constructor(node: Node) {
        super(node, [compUndefined]);
    }
}
