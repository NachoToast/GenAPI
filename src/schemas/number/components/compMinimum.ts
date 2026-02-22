import type { Node } from "typescript";
import { ValidationError } from "@/errors/ValidationError";
import { getJsDocTag } from "@/jsDoc/getJsDocTag";
import type { OAS } from "@/OAS";
import type { SchemaComponent } from "@/schemas/base/SchemaComponent";
import type { ValueValidationFn } from "@/types/ValidationFns";

function ensureIsNotLessThan(min: number): ValueValidationFn<number> {
    const message = `Cannot be less than ${min}`;

    return (input: number) => {
        if (input < min) {
            throw new ValidationError(message);
        }
    };
}

class CompMinimum implements SchemaComponent<number> {
    private readonly minimum: number;

    public constructor(minimum: number) {
        this.minimum = minimum;
    }

    public getName(): string {
        return "@min";
    }

    public doSchemaActions(schema: OAS.Schema): void {
        schema.minimum = this.minimum;
    }

    public *getValueValidators(): Generator<ValueValidationFn<number>> {
        yield ensureIsNotLessThan(this.minimum);
    }

    public conflictsWith(other: SchemaComponent<number>): boolean {
        return other instanceof CompMinimum;
    }
}

export function compMinimum(node: Node, isInteger: boolean): CompMinimum | null {
    const minimum = getJsDocTag(node, "min", (x) => (isInteger ? x.integer() : x.number()));

    if (minimum !== null) {
        return new CompMinimum(minimum);
    }

    return null;
}
