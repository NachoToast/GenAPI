import type { Node, TypeChecker } from "typescript";
import { handleNode } from "@/handlers/handleNode";
import type { AnySchemaObject, SchemaObject } from "@/schemas/base/SchemaObject";
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
): AnySchemaObject | null {
    return handleNode(createTestNode(code, getFn), {
        schemaDb: new Map(),
        get typeChecker(): TypeChecker {
            throw new Error("Cannot use the TypeChecker in a test context!");
        },
    });
}
