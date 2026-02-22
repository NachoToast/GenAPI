import type { Node } from "typescript";
import { ValidationError } from "@/errors/ValidationError";
import { getJsDocTag } from "@/jsDoc/getJsDocTag";
import type { OAS } from "@/OAS";
import type { SchemaComponent } from "@/schemas/base/SchemaComponent";
import type { ValueValidationFn } from "@/types/ValidationFns";

function ensureIsNotLongerThan(max: number): ValueValidationFn<string> {
    const characters = max === 1 ? "character" : "characters";
    const message = `Cannot be greater than ${max} ${characters} long`;

    return (input: string) => {
        if (input.length > max) {
            throw new ValidationError(message);
        }
    };
}

class CompMaxLength implements SchemaComponent<string> {
    private readonly maxLength: number;

    public constructor(maxLength: number) {
        this.maxLength = maxLength;
    }

    public getName(): string {
        return "@maxLength";
    }

    public doSchemaActions(schema: OAS.Schema): void {
        schema.maxLength = this.maxLength;
    }

    public *getValueValidators(): Generator<ValueValidationFn<string>> {
        yield ensureIsNotLongerThan(this.maxLength);
    }

    public conflictsWith(other: SchemaComponent<string>): boolean {
        return other instanceof CompMaxLength;
    }
}

export function compMaxLength(node: Node): CompMaxLength | null {
    const maxLength = getJsDocTag(node, "maxLength", (x) => x.integer().min(0));

    if (maxLength !== null) {
        return new CompMaxLength(maxLength);
    }

    return null;
}
