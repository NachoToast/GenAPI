import type { OAS } from "@/OAS";
import type { SchemaComponent } from "@/schemas/base/SchemaComponent";
import type { TypeValidationFn } from "@/types/ValidationFns";
import { SchemaFlag } from "../base/SchemaFlag";

function alwaysPass(): void {}

/** Signifies the schema as representing the `unknown` type. */
export const compTypeUnknown: SchemaComponent<unknown> = {
    copyToIdentified(): SchemaComponent<unknown> {
        return this;
    },

    *getFlags(): Generator<SchemaFlag> {
        yield SchemaFlag.RemovedInUnions;
    },

    doSchemaActions(schema: OAS.Schema): void {
        schema.description ??= "Represents the `unknown` type.";
    },

    *getTypeValidators(): Generator<TypeValidationFn<unknown>> {
        // It's worth noting that although this validator is identical to that of compTypeAny,
        // we don't log a warning about lacking validation here since the 'unknown' type is
        // inherently safer than the 'any' type.
        yield alwaysPass;
    },

    *getValidationSummary(): Generator<string> {
        yield "unknownthing";
    },
};
