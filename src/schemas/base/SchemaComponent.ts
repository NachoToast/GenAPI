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
    /**
     * Additional actions to run once the schema this component is attached to has been fully
     * initialised.
     */
    postInitActions?(schemaObject: SchemaObject<T>): void;

    /** Modifications to the output JSON schema go here. */
    doSchemaActions?(schema: OAS.Schema): void;

    getTypeValidators?(): Generator<TypeValidationFn<T>>;

    getValueValidators?(): Generator<ValueValidationFn<T>>;

    getAlternateValidators?(): Generator<AlternateValidationFn>;

    getValidationSummary?(): Generator<string>;

    /** Any mutual exclusion logic should go here. */
    doCopyFrom?(other: SchemaComponent<T>): void;
}
