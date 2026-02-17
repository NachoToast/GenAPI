import type { OAS } from "@/OAS";
import type { SchemaComponent } from "@/schemas/base/SchemaComponent";
import type { TypeValidationFn } from "@/types/ValidationFns";

function alwaysPass(): void {}

/** Signifies the schema as representing the `unknown` type. */
export const compUnknown: SchemaComponent<unknown> = {
    doSchemaActions(schema: OAS.Schema): void {
        schema.description ??= "Represents the `unknown` type.";
    },

    *getTypeValidators(): Generator<TypeValidationFn<unknown>> {
        // It's worth noting that although this validator is identical to that of compAny, we don't
        // log a warning about lacking validation here since the 'unknown' type is inherently safer
        // than the 'any' type.
        yield alwaysPass;
    },

    *getValidationSummary(): Generator<string> {
        yield "unknown";
    },
};
