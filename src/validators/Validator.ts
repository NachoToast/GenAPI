export type ValidationInputType =
    | "string"
    | "number"
    | "bigint"
    | "boolean"
    | "symbol"
    | "undefined"
    | "object"
    | "function";

export abstract class Validator {
    public abstract validate(input: unknown): unknown;

    protected static getNounFor(type: ValidationInputType): string {
        // biome-ignore lint/nursery/noUnnecessaryConditions: Biome is not smart
        switch (type) {
            case "object":
                return "an object";
            case "undefined":
                return "undefined";
            default:
                return `a ${type}`;
        }
    }

    protected static toList(values: string[]): string {
        if (values.length === 0) {
            return "";
        }

        if (values.length === 1) {
            return values[0];
        }

        if (values.length === 2) {
            return `${values[0]} or ${values[1]}`;
        }

        const lastValue = values.slice(-1)[0];
        const otherValues = values.slice(0, -1).join(", ");

        return `${otherValues}, or ${lastValue}`;
    }
}
