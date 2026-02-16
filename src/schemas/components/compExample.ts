import type { Node } from "typescript";
import { ParserError } from "@/errors/ParserError";
import { ValidationError } from "@/errors/ValidationError";
import { getJsDocExample } from "@/jsDoc/getJsDocExample";
import type { OAS } from "@/OAS";
import type { SchemaComponent } from "../base/SchemaComponent";
import type { SchemaObject } from "../base/SchemaObject";

/**
 * Sets the schema `example` field to the JSDoc **@example** tag on the given node.
 *
 * Also validates the value of the tag against the schema object.
 */
class CompExample<T> implements SchemaComponent<T> {
    private readonly example: T;

    private readonly transformFn: (input: string) => T;

    public constructor(example: T, transformFn: (input: string) => T) {
        this.example = example;
        this.transformFn = transformFn;
    }

    public copyToIdentified(node: Node): SchemaComponent<T> {
        // prefer the most-recently identified example if present
        const example = getJsDocExample(node, this.transformFn);

        if (example !== null) {
            return new CompExample(example, this.transformFn);
        }

        return this;
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
}

function createCompExampleFor<T>(transformFn: (input: string) => T): SchemaComponent<T> {
    return {
        copyToIdentified(node: Node): SchemaComponent<T> {
            const example = getJsDocExample(node, transformFn);

            if (example !== null) {
                return new CompExample(example, transformFn);
            }

            return this;
        },
    };
}

function parseBoolean(value: string): boolean {
    return value.toLowerCase() === "true";
}

export const compExampleString: SchemaComponent<string> = createCompExampleFor(String);

export const compExampleNumber: SchemaComponent<number> = createCompExampleFor(Number);

export const compExampleBoolean: SchemaComponent<boolean> = createCompExampleFor(parseBoolean);
