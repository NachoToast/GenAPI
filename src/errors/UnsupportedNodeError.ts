import type { Node } from "typescript";
import { ParserError } from "./ParserError";

export class UnsupportedNodeError extends ParserError {
    public constructor(node: Node) {
        super(node, "Unsure how to handle a node of this kind");
    }
}
