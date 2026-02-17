import { ValidationError } from "@/errors/ValidationError";
import type { OAS } from "@/OAS";
import type { SchemaComponent } from "@/schemas/base/SchemaComponent";
import type { AnyObject } from "@/types/AnyObject";
import type { ValueValidationFn } from "@/types/ValidationFns";
import { formatList } from "@/utils/formatList";

/** Like {@link formatList} but puts each value inside quotes first. */
function quoteAndFormatList(values: string[], conjunction: string): string {
    return formatList(
        values.map((x) => `"${x}"`),
        conjunction,
    );
}

function ensureHasAllRequiredKeys(keys: string[]): ValueValidationFn<AnyObject> {
    return (input: AnyObject) => {
        const missingKeys: string[] = [];

        for (const key of keys) {
            if (!Object.hasOwn(input, key)) {
                missingKeys.push(key);
            }
        }

        switch (missingKeys.length) {
            case 0:
                break;
            case 1:
                throw new ValidationError(`Missing required property: "${missingKeys[0]}"`);
            default:
                throw new ValidationError(
                    `Missing ${missingKeys.length} required properties: ${quoteAndFormatList(missingKeys, "and")}`,
                );
        }
    };
}

/**
 * Sets the schema `required` field to the given {@link requiredKeys} and validates object inputs
 * against them.
 */
export class CompRequired implements SchemaComponent<AnyObject> {
    private readonly requiredKeys: string[] = [];

    public copyToIdentified(): SchemaComponent<AnyObject> {
        return this;
    }

    public doSchemaActions(schema: OAS.Schema): void {
        if (this.requiredKeys.length > 0) {
            schema.required = this.requiredKeys.values().toArray();
        }
    }

    public *getValueValidators(): Generator<ValueValidationFn<AnyObject>> {
        yield ensureHasAllRequiredKeys(this.requiredKeys);
    }

    public addKey(key: string): void {
        this.requiredKeys.push(key);
    }
}
