import { createSourceFile, type Node, ScriptTarget } from "typescript";

/**
 * Parses the given {@link code} string and attempts to find a node validated by the {@link getFn}.
 *
 * For testing purposes only.
 */
export function createTestNode<T extends Node>(code: string, getFn: (node: Node) => node is T): T {
    const sourceFile = createSourceFile("testNode.ts", code.trim(), ScriptTarget.ESNext, true);

    const finalNode = sourceFile.forEachChild((node) => {
        if (getFn(node)) {
            return node;
        }

        return;
    });

    if (finalNode === undefined) {
        throw new Error("Unable to find node");
    }

    return finalNode;
}
