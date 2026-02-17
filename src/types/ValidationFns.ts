/** A function that checks the **type** of an input. */
export type TypeValidationFn<T> = (input: unknown) => asserts input is T;

/** A function that checks the **value** of an input. */
export type ValueValidationFn<T> = (input: T) => void;

/** A function that determines whether an input can skip all other validation, use with care. */
export type AlternateValidationFn = (input: unknown) => boolean;

export type FinalValidationFn = (input: unknown) => void;
