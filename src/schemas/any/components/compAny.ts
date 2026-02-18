import type { OAS } from "@/OAS";
import type { SchemaComponent } from "@/schemas/base/SchemaComponent";
import type { TypeValidationFn } from "@/types/ValidationFns";

function alwaysPass(): void {}

/** Signifies the schema as representing the `any` type. */
export const compAny: SchemaComponent<unknown> = {
    doSchemaActions(schema: OAS.Schema): void {
        schema.description ??= "Represents the `any` type.";
    },

    *getTypeValidators(): Generator<TypeValidationFn<unknown>> {
        console.warn(
            'Warning: A schema object representing the "any" type is being used for validation',
        );

        yield alwaysPass;
    },

    *getValidationSummary(): Generator<string> {
        yield "anything";
    },
};
