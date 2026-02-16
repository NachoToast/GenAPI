import { ValidationError } from "@/errors/ValidationError";
import type { OAS } from "@/OAS";
import type { SchemaComponent } from "@/schemas/base/SchemaComponent";
import type { SchemaObject } from "@/schemas/base/SchemaObject";
import type { AnyObject } from "@/types/AnyObject";
import type { ValidationFn } from "@/types/ValidationFns";

function ensureIsValidProperty(key: string, validationFn: ValidationFn): ValidationFn<AnyObject> {
    return (input: AnyObject) => {
        if (!Object.hasOwn(input, key)) {
            // presence of a key is checked by CompRequiredKeys
            return;
        }

        try {
            validationFn(input[key]);
        } catch (error) {
            if (!(error instanceof ValidationError)) {
                throw error;
            }

            throw new ValidationError(`${key}: ${error.message}`);
        }
    };
}

/**
 * Sets the schema `properties` field to the given {@link properties} and validates object inputs
 * against them.
 */
export class CompProperties implements SchemaComponent<AnyObject> {
    private readonly properties: Record<string, SchemaObject<unknown>> = {};

    public copyToIdentified(): SchemaComponent<AnyObject> {
        return this;
    }

    public doSchemaActions(schema: OAS.Schema): void {
        if (Object.keys(this.properties).length > 0) {
            const output: Record<string, OAS.Schema | OAS.Reference> = {};

            for (const [key, value] of Object.entries(this.properties)) {
                output[key] = value.toJson();
            }

            schema.properties = output;
        }
    }

    public *getExtraValidators(): Generator<ValidationFn<AnyObject>> {
        for (const [key, schema] of Object.entries(this.properties)) {
            yield ensureIsValidProperty(key, schema.makeValidator());
        }
    }

    public addProperty(name: string, schema: SchemaObject<unknown>): void {
        this.properties[name] = schema;
    }
}
