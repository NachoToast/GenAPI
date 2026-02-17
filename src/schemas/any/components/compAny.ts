/** biome-ignore-all lint/suspicious/noExplicitAny: consumer's fault, not mine */

import type { OAS } from "@/OAS";
import type { SchemaComponent } from "@/schemas/base/SchemaComponent";
import type { TypeValidationFn } from "@/types/ValidationFns";

function alwaysPass(): void {}

/** Signifies the schema as representing the `any` type. */
export const compAny: SchemaComponent<any> = {
    doSchemaActions(schema: OAS.Schema): void {
        schema.description ??= "Represents the `any` type.";
    },

    *getTypeValidators(): Generator<TypeValidationFn<any>> {
        console.warn(
            'Warning: A schema object representing the "any" type is being used for validation',
        );

        yield alwaysPass;
    },

    *getValidationSummary(): Generator<string> {
        yield "anything";
    },
};
