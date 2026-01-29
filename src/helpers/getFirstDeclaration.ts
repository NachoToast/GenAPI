import type { VariableDeclaration, VariableStatement } from "typescript";
import { ParserError } from "@/errors/ParserError";

/**
 * Gets the first {@link VariableDeclaration} of a {@link VariableStatement}.
 *
 * @example
 * ```ts
 * const someVar: SomeType = { ... }
 * // => someVar: SomeType = { ... }
 * ```
 */
export function getFirstDeclaration(node: VariableStatement): VariableDeclaration {
    const first = node.declarationList.declarations.at(0);

    if (first === undefined) {
        throw new ParserError(node, "Expected declarationList.declarations[0] to be defined");
    }

    return first;
}
