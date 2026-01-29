import {
    isPropertyAssignment,
    type ObjectLiteralExpression,
    type PropertyAssignment,
} from "typescript";

/**
 * Enumerates through the {@link PropertyAssignment}s of an {@link ObjectLiteralExpression}.
 *
 * @example
 * ```ts
 * const myObj = { keyA: ..., keyB: ..., keyC: ... }
 * // => [keyA, keyB, keyC]
 * ```
 */
export function* enumerateProperties(node: ObjectLiteralExpression): Generator<PropertyAssignment> {
    for (const property of node.properties) {
        if (isPropertyAssignment(property)) {
            yield property;
        }
    }
}
