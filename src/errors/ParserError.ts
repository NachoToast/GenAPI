import { type Node, SyntaxKind } from "typescript";
import { getNodeLocation } from "@/utils/getNodeLocation";

/** Error related to navigating through the AST of a source file. */
export class ParserError extends Error {
    public constructor(node: Node, message: string) {
        super(
            `ParserError with ${SyntaxKind[node.kind]} node at ${getNodeLocation(node)}: ${message}`,
        );
    }
}
