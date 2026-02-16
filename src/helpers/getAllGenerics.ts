import type { NodeArray, TypeNode, TypeReferenceNode } from "typescript";
import { ParserError } from "@/errors/ParserError";

/**
 * Extracts all the generics of a {@link TypeReferenceNode}.
 *
 * @example
 * ```ts
 * const myVariable: MyType<A, B, C> = { ... }
 * // => [A, B, C]
 * ```
 */
export function getAllGenerics(node: TypeReferenceNode): NodeArray<TypeNode> {
    if (node.typeArguments === undefined) {
        throw new ParserError(node, "Expected typeArguments to be defined");
    }

    return node.typeArguments;
}
