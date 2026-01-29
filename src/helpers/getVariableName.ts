import { isIdentifier, SyntaxKind, type VariableStatement } from "typescript";
import { ParserError } from "@/errors/ParserError";

/**
 * Extracts the name of a {@link VariableStatement}.
 *
 * @example
 * ```ts
 * const myVariable = { ... }
 * // => "myVariable"
 * ```
 */
export function getVariableName(node: VariableStatement): string {
    const declaration = node.declarationList.declarations.at(0);

    if (declaration === undefined) {
        throw new ParserError(
            node.declarationList,
            "Expected declarationList.declarations[0] to be defined",
        );
    }

    const identifier = declaration.name;

    if (!isIdentifier(identifier)) {
        throw new ParserError(
            identifier,
            `Expected an Identifier node but got ${SyntaxKind[identifier.kind]}`,
        );
    }

    return identifier.escapedText.toString();
}
