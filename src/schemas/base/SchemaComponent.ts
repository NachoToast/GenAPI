import type { OAS } from "@/OAS";
import type {
    AlternateValidationFn,
    TypeValidationFn,
    ValueValidationFn,
} from "@/types/ValidationFns";
import type { SchemaObject } from "./SchemaObject";

/**
 * Compositional logic blocks, these get attached to schema objects and can alter their output
 * JSON schema, validation logic, and more.
 */
export interface SchemaComponent<T> {
    readonly disallowCopyingToReferenced?: true;

    /** For debugging and error logging purposes only. */
    getName(): string;

    /**
     * Additional actions to run once the schema object that this component is attached to has
     * been fully initialised.
     */
    postInitActions?(schemaObject: SchemaObject<T>): void;

    /** Modifications to the output JSON schema go. */
    doSchemaActions?(schema: OAS.Schema): void;

    getTypeValidators?(): Generator<TypeValidationFn<T>>;

    getValueValidators?(): Generator<ValueValidationFn<T>>;

    getAlternateValidators?(): Generator<AlternateValidationFn>;

    getTypeValidationSummary?(): Generator<string>;

    /** This should, at the very least, return `true` for components that are the same type. */
    conflictsWith(other: SchemaComponent<T>): boolean;

    /** Custom logic to try resolve conflicts (found via {@link conflictsWith}). */
    tryResolveConflictWith?(other: this): SchemaComponent<T> | null;
}
