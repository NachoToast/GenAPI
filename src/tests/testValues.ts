export const testStrings: string[] = ["", "example", "\n", "  untrimmed   "];

export const testIntegers: number[] = [
    Number.MIN_SAFE_INTEGER,
    Number.MAX_SAFE_INTEGER,
    Number.MAX_VALUE,
    -5,
    -1,
    0,
    1,
    5,
];

export const testNonIntegers: number[] = [
    -123.45,
    123.45,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
    Number.EPSILON,
    Math.PI,
    Number.MIN_VALUE,
];

export const testNumbers: number[] = [...testIntegers, ...testNonIntegers];

export const testArrays: unknown[] = [[], ["single"], ["a", "b"], ["a", 1, "b", 2], [true]];

export const testObjects: Record<string | number | symbol, unknown>[] = [
    {},
    { foo: "bar" },
    { 12: "34" },
];

export const testOther: unknown[] = [null, undefined, Symbol(), Number.NaN];

const testTypesObject = {
    strings: testStrings,
    integers: testIntegers,
    nonIntegers: testNonIntegers,
    arrays: testArrays,
    objects: testObjects,
    other: testOther,
} as const;

export function* testValuesExcept(...keys: (keyof typeof testTypesObject)[]): Generator<unknown> {
    const keysToIterate = new Set<keyof typeof testTypesObject>([
        "strings",
        "integers",
        "nonIntegers",
        "arrays",
        "objects",
        "other",
    ]);

    for (const key of keys) {
        keysToIterate.delete(key);
    }

    for (const key of keysToIterate) {
        yield* testTypesObject[key];
    }
}
