import { createSourceFile, type Node, ScriptTarget, type TypeChecker } from "typescript";
import { ReferenceDatabase } from "@/classes/ReferenceDatabase";
import { handleNode } from "@/handlers/handleNode";
import type { SchemaObject } from "@/schemas/SchemaObject";

/**
 * Parses the given {@link code} string and attempts to find a node validated by the
 * {@link getFn}.
 *
 * For testing purposes only.
 */
export function testNode<T extends Node>(code: string, getFn: (node: Node) => node is T): T {
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

export function testSchema<T extends Node>(
    code: string,
    getFn: (node: Node) => node is T,
): SchemaObject | null {
    return handleNode(testNode(code, getFn), {
        refDb: new ReferenceDatabase(),
        get typeChecker(): TypeChecker {
            throw new Error("TypeChecker mock called!");
        },
        handleNode,
    });
}
