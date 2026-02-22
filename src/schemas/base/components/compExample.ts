import type { Node } from "typescript";
import { ParserError } from "@/errors/ParserError";
import { ValidationError } from "@/errors/ValidationError";
import { getJsDocExample } from "@/jsDoc/getJsDocExample";
import type { OAS } from "@/OAS";
import type { SchemaComponent } from "../SchemaComponent";
import type { SchemaObject } from "../SchemaObject";

/** JSDoc **\@example** tag. */
export class CompExample<T> implements SchemaComponent<T> {
    private readonly example: T;

    public constructor(example: T) {
        this.example = example;
    }

    public getName(): string {
        return "@example";
    }

    public postInitActions(schemaObject: SchemaObject<T>): void {
        const validator = schemaObject.makeValidator();

        try {
            validator(this.example);
        } catch (error) {
            if (!(error instanceof ValidationError)) {
                throw error;
            }

            throw new ParserError(
                schemaObject.node,
                `JSDoc example tag does not conform to the schema: ${error.message}`,
            );
        }
    }

    public doSchemaActions(schema: OAS.Schema): void {
        schema.example = this.example;
    }

    public conflictsWith(other: SchemaComponent<T>): boolean {
        return other instanceof CompExample;
    }

    public tryResolveConflictWith(other: this): CompExample<T> {
        return other;
    }
}

export function compExample<T>(
    node: Node,
    transformFn: (input: string) => T,
): CompExample<T> | null {
    const example = getJsDocExample(node, transformFn);

    if (example !== null) {
        return new CompExample(example);
    }

    return null;
}
