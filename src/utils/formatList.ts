/**
 * Formats a list of {@link values} in a human format.
 *
 * @example
 * ```ts
 * formatList(["a"], "or"); // "a"
 * formatList(["a, b"], "and"); // "a and b"
 * formatList(["a", "b", "c"], "or"); // "a, b, or c"
 * formatList(["a", "b", "c", "d"], "and"); // "a, b, c, and d"
 * ```
 *
 * @throws Throws an {@link Error} if {@link values} is an empty array.
 */
export function formatList(values: string[], conjunction: string): string {
    if (values.length === 0) {
        throw new Error("Cannot format a list with 0 items");
    }

    if (values.length === 1) {
        return values[0];
    }

    if (values.length === 2) {
        return `${values[0]} ${conjunction} ${values[1]}`;
    }

    const lastValue = values.slice(-1)[0];
    const otherValues = values.slice(0, -1);

    return `${otherValues.join(", ")}, ${conjunction} ${lastValue}`;
}
