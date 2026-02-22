import type { OAS } from "@/OAS";
import type { SchemaComponent } from "@/schemas/base/SchemaComponent";
import type { TypeValidationFn } from "@/types/ValidationFns";

function alwaysPass(): void {}

export const compAny: SchemaComponent<unknown> = {
    getName(): string {
        return "type(any)";
    },

    doSchemaActions(schema: OAS.Schema): void {
        schema.description ??= "Represents the `any` type.";
    },

    *getTypeValidators(): Generator<TypeValidationFn<unknown>> {
        console.warn(
            'Warning: A schema object representing the "any" type is being used for validation',
        );

        yield alwaysPass;
    },

    *getTypeValidationSummary(): Generator<string> {
        yield "anything";
    },

    conflictsWith(other: SchemaComponent<unknown>): boolean {
        return other === this;
    },
};
