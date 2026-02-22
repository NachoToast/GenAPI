import { isIdentifier, isStringLiteral, type ObjectLiteralExpression } from "typescript";
import { ParserError } from "@/errors/ParserError";
import { enumerateProperties } from "./enumerateProperties";

/**
 * Finds and retrieves the value of a string literal in an {@link ObjectLiteralExpression}.
 *
 * @example
 * ```ts
 * const myObj = { keyA: "valueA", keyB: "valueB" }
 * // keyA => "ValueA", keyC => null
 * ```
 */
export function getPropertyValueString(node: ObjectLiteralExpression, key: string): string {
    for (const expression of enumerateProperties(node)) {
        const identifier = expression.name;

        if (!isIdentifier(identifier)) {
            continue;
        }

        const name = identifier.escapedText.toString();

        if (name !== key) {
            continue;
        }

        const initialiser = expression.initializer;

        if (!isStringLiteral(initialiser)) {
            throw new ParserError(initialiser, `Expected a string literal value for key "${key}"`);
        }

        return initialiser.text.toString();
    }

    throw new ParserError(node, `Expected property "${key}" to be defined`);
}
