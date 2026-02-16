import type { Node } from "typescript";
import type { OAS } from "@/OAS";
import type { AlternateValidationFn, TypeValidationFn, ValidationFn } from "@/types/ValidationFns";
import type { SchemaFlag } from "./SchemaFlag";
import type { SchemaObject } from "./SchemaObject";

/**
 * Compositional logic blocks, these get attached to schema objects and can alter their output
 * JSON schema, validation logic, and more.
 */
export interface SchemaComponent<T> {
    /**
     * Run when the schema object is referenced by an identifier.
     *
     * This method is normally used to find JSDoc tags, but can also just return the current
     * component (`this`) if nothing special needs to happen.
     */
    copyToIdentified(node: Node): SchemaComponent<T>;

    getFlags?(): Generator<SchemaFlag>;

    /**
     * Additional actions to run once the schema this component is attached to has been fully
     * initialised.
     */
    postInitActions?(schemaObject: SchemaObject<T>): void;

    /** Modifications to the output JSON schema go here. */
    doSchemaActions?(schema: OAS.Schema): void;

    getTypeValidators?(): Generator<TypeValidationFn<T>>;

    getExtraValidators?(): Generator<ValidationFn<T>>;

    getAlternateValidators?(): Generator<AlternateValidationFn>;

    getValidationSummary?(): Generator<string>;
}
