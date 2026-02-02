import { isTypeAliasDeclaration, type TypeAliasDeclaration } from "typescript";
import { createTestNode } from "./createTestNode";

/**
 * Creates a basic {@link TypeAliasDeclaration} node.
 *
 * For testing purposes only.
 */
export function createDefaultTestNode(): TypeAliasDeclaration {
    return createTestNode("type X = 123", isTypeAliasDeclaration);
}
