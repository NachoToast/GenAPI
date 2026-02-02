import type { Node, TypeChecker } from "typescript";
import { ReferenceDatabase } from "@/classes/ReferenceDatabase";
import { handleNode } from "@/handlers/handleNode";
import type { SchemaObject } from "@/schemas/SchemaObject";
import { createTestNode } from "./createTestNode";

/**
 * Parses the given {@link code} string to create a {@link SchemaObject}.
 *
 * Nodes that require the {@link TypeChecker} for parsing (such as type references) are **not**
 * parseable by this function, since a program object is not created.
 *
 * For testing purposes only.
 */
export function createTestSchema<T extends Node>(
    code: string,
    getFn: (node: Node) => node is T,
): SchemaObject | null {
    return handleNode(createTestNode(code, getFn), {
        refDb: new ReferenceDatabase(),
        get typeChecker(): TypeChecker {
            throw new Error("Cannot use the TypeChecker in a test context!");
        },
    });
}
