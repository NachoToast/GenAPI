/** biome-ignore-all lint/suspicious/noExplicitAny: consumer's fault, not mine */

import type { OAS } from "@/OAS";
import type { SchemaComponent } from "@/schemas/base/SchemaComponent";
import type { TypeValidationFn } from "@/types/ValidationFns";
import { SchemaFlag } from "../base/SchemaFlag";

function alwaysPass(): void {}

/** Signifies the schema as representing the `any` type. */
export const compTypeAny: SchemaComponent<any> = {
    copyToIdentified(): SchemaComponent<any> {
        return this;
    },

    *getFlags(): Generator<SchemaFlag> {
        yield SchemaFlag.TakesOverUnions;
    },

    doSchemaActions(schema: OAS.Schema): void {
        schema.description ??= "Represents the `any` type.";
    },

    *getTypeValidators(): Generator<TypeValidationFn<any>> {
        console.warn(
            "Warning: A schema object representing the any type is being used for validation",
        );

        yield alwaysPass;
    },

    *getValidationSummary(): Generator<string> {
        yield "anything";
    },
};
