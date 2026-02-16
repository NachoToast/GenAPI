/**
 * Initial validation functions, these should check the **type** of the input and nothing more.
 *
 * These are also used in unions to determine which validation path to go down.
 */
export type TypeValidationFn<T> = (input: unknown) => asserts input is T;

/** Extra validation functions, these should check the value of the input. */
export type ValidationFn<T = unknown> = (input: T) => void;

/**
 * An alternate to type and extra validation functions.
 *
 * If any of these return true, all other validators should be skipped.
 */
export type AlternateValidationFn = (input: unknown) => boolean;
