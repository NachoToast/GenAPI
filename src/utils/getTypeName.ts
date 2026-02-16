/**
 * The type of a JavaScript object or primitive.
 *
 * This is returned by the `typeof` operator.
 */
type LanguageType =
    | "string"
    | "number"
    | "bigint"
    | "boolean"
    | "symbol"
    | "undefined"
    | "object"
    | "function";

/**
 * Returns the noun with its indefinite article of the given {@link type}.
 *
 * @example
 * ```ts
 * getTypeName("object"); // "an object"
 * getTypeName("undefined"); // "undefined"
 * getTypeName("number"); // "a number"
 * ```
 */
export function getTypeName(type: LanguageType): string {
    // biome-ignore lint/nursery/noUnnecessaryConditions: Biome is not smart
    switch (type) {
        case "object":
            return "an object";
        case "undefined":
            return "undefined";
        default:
            return `a ${type}`;
    }
}
