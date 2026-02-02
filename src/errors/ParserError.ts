import { type Node, SyntaxKind } from "typescript";
import { getSource } from "@/helpers/getSource";

/**
 * Error related to navigating through the AST of a source file.
 *
 * @see {@link https://ts-ast-viewer.com TypeScript AST Viewer}
 */
export class ParserError extends Error {
    protected node: Node;

    public constructor(node: Node, message: string) {
        super(message);
        this.node = node;
    }

    /**
     * For the purposes of logging, use this instead of the {@link ParserError} itself, as the
     * latter contains a {@link Node} object which shows a lot of useless information when logged.
     */
    public makeChild(): Error {
        return new Error(
            `ParserError with ${SyntaxKind[this.node.kind]} node at ${getSource(this.node)}: ${this.message}`,
        );
    }
}
