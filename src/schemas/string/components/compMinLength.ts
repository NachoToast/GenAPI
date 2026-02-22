import type { Node } from "typescript";
import { ValidationError } from "@/errors/ValidationError";
import { getJsDocTag } from "@/jsDoc/getJsDocTag";
import type { OAS } from "@/OAS";
import type { SchemaComponent } from "@/schemas/base/SchemaComponent";
import type { ValueValidationFn } from "@/types/ValidationFns";

function ensureIsNotShorterThan(min: number): ValueValidationFn<string> {
    const characters = min === 1 ? "character" : "characters";
    const message = `Cannot be less than ${min} ${characters} long`;

    return (input: string) => {
        if (input.length < min) {
            throw new ValidationError(message);
        }
    };
}

export class CompMinLength implements SchemaComponent<string> {
    private readonly minLength: number;

    public constructor(minLength: number) {
        this.minLength = minLength;
    }

    public getName(): string {
        return "@minLength";
    }

    public doSchemaActions(schema: OAS.Schema): void {
        schema.minLength = this.minLength;
    }

    public *getValueValidators(): Generator<ValueValidationFn<string>> {
        yield ensureIsNotShorterThan(this.minLength);
    }

    public conflictsWith(other: SchemaComponent<string>): boolean {
        return other instanceof CompMinLength;
    }
}

export function compMinLength(node: Node): CompMinLength | null {
    // minimum of 1, since allowing 0-length strings can be done by simply omitting the tag
    const minLength = getJsDocTag(node, "minLength", (x) => x.integer().min(1));

    if (minLength !== null) {
        return new CompMinLength(minLength);
    }

    return null;
}
