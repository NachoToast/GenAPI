import { isTypeReferenceNode, type NodeArray, SyntaxKind, type TypeNode } from "typescript";
import { ParserError } from "@/errors/ParserError";

/**
 * Extracts all the generics of a {@link TypeNode}.
 *
 * @example
 * ```ts
 * const myVariable: MyType<A, B, C> = { ... }
 * // => [A, B, C]
 * ```
 */
export function getAllGenerics(node: TypeNode, required?: false): NodeArray<TypeNode> | null;
export function getAllGenerics(node: TypeNode, required: true): NodeArray<TypeNode>;
export function getAllGenerics(node: TypeNode, required?: boolean): NodeArray<TypeNode> | null {
    if (!isTypeReferenceNode(node)) {
        throw new ParserError(
            node,
            `Expected a TypeReferenceNode node but got ${SyntaxKind[node.kind]}`,
        );
    }

    if (node.typeArguments === undefined) {
        if (required) {
            throw new ParserError(node, "Expected typeArguments to be defined");
        }

        return null;
    }

    return node.typeArguments;
}
