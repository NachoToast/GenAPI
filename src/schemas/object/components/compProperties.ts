import { ValidationError } from "@/errors/ValidationError";
import type { OAS } from "@/OAS";
import type { SchemaComponent } from "@/schemas/base/SchemaComponent";
import type { AnySchemaObject } from "@/schemas/base/SchemaObject";
import type { AnyObject } from "@/types/AnyObject";
import type { ValueValidationFn } from "@/types/ValidationFns";

function ensureIsValidProperty(
    key: string,
    validationFn: ValueValidationFn<unknown>,
): ValueValidationFn<AnyObject> {
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

            throw new ValidationError(`Error with property "${key}": ${error.message}`);
        }
    };
}

export class CompProperties implements SchemaComponent<AnyObject> {
    public readonly disallowCopyingToReferenced = true;

    private readonly properties: Record<string, AnySchemaObject> = {};

    public getName(): string {
        return "properties";
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

    public *getValueValidators(): Generator<ValueValidationFn<AnyObject>> {
        for (const [key, schema] of Object.entries(this.properties)) {
            yield ensureIsValidProperty(key, schema.makeValidator());
        }
    }

    public conflictsWith(other: SchemaComponent<AnyObject>): boolean {
        return other instanceof CompProperties;
    }

    public addProperty(key: string, value: AnySchemaObject): void {
        this.properties[key] = value;
    }
}
