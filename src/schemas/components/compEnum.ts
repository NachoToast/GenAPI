import { ValidationError } from "@/errors/ValidationError";
import type { OAS } from "@/OAS";
import type { TypeValidationFn } from "@/types/ValidationFns";
import { formatList } from "@/utils/formatList";
import type { SchemaComponent } from "../base/SchemaComponent";

type StringFn<T> = (x: T) => string;

function ensureIsExactly<T>(value: T, stringFn: StringFn<T>): TypeValidationFn<T> {
    const message = `Must be ${stringFn(value)}`;

    return (input: unknown) => {
        if (input !== value) {
            throw new ValidationError(message);
        }
    };
}

function ensureIsAnyOf<T>(values: T[], stringFn: StringFn<T>): TypeValidationFn<T> {
    const valuesString = values.map((x) => stringFn(x));

    const message = `Must be ${formatList(valuesString, "or")}`;

    const valueSet = new Set<unknown>(values);

    return (input: unknown) => {
        if (!valueSet.has(input)) {
            throw new ValidationError(message);
        }
    };
}

/** Sets the schema `enum` field to the given {@link values} and validates inputs against them. */
export class CompEnum<T> implements SchemaComponent<T> {
    private readonly values: T[];

    private readonly stringFn: StringFn<T>;

    public constructor(values: T[], stringFn: StringFn<T>) {
        this.values = values;
        this.stringFn = stringFn;
    }

    public copyToIdentified(): SchemaComponent<T> {
        return this;
    }

    public doSchemaActions(schema: OAS.Schema): void {
        schema.enum = this.values;
    }

    public *getTypeValidators(): Generator<TypeValidationFn<T>> {
        if (this.values.length === 1) {
            yield ensureIsExactly(this.values[0], this.stringFn);
        } else {
            yield ensureIsAnyOf(this.values, this.stringFn);
        }
    }

    public *getValidationSummary(): Generator<string> {
        yield* this.values.map((x) => this.stringFn(x));
    }

    public addValue(value: T): void {
        this.values.push(value);
    }
}

export function compEnum<T>(values: T[], stringFn: StringFn<T>): CompEnum<T> {
    return new CompEnum(values, stringFn);
}
