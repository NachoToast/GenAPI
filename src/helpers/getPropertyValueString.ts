import {
    isIdentifier,
    isStringLiteral,
    type ObjectLiteralExpression,
    SyntaxKind,
} from "typescript";
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
export function getPropertyValueString(
    node: ObjectLiteralExpression,
    key: string,
    required?: false,
): string | null;
export function getPropertyValueString(
    node: ObjectLiteralExpression,
    key: string,
    required: true,
): string;
export function getPropertyValueString(
    node: ObjectLiteralExpression,
    key: string,
    required?: boolean,
): string | null {
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
            throw new ParserError(
                node,
                `Expected initialiser of key "${key}" to be a StringLiteral node but got ${SyntaxKind[initialiser.kind]}`,
            );
        }

        return initialiser.text.toString();
    }

    if (required) {
        throw new ParserError(node, `Expected property "${key}" to be defined`);
    }

    return null;
}
