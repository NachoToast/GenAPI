import { isIdentifier, type VariableStatement } from "typescript";
import { ParserError } from "@/errors/ParserError";
import { getFirstDeclaration } from "./getFirstDeclaration";

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
    const { name } = getFirstDeclaration(node);

    if (!isIdentifier(name)) {
        throw new ParserError(name, "Expected the variable name to be an identifier");
    }

    return name.escapedText.toString();
}
