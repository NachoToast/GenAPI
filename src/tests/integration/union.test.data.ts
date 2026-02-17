/** Test description. */
export type SimpleUnion = string | number;

/** @example "test example" */
export type NullUnion = string | null;

/** @minLength 19 */
type SomeAliased = string;

export type UnionWithAlias = string | null | SomeAliased;
