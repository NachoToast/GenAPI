import type { Node } from "typescript";
import type { OAS } from "@/OAS";
import type { NamedSchemaObject } from "@/schemas/NamedSchemaObject";
import { ParserError } from "../errors/ParserError";

export class ReferenceDatabase {
    private readonly values = new Set<NamedSchemaObject>();

    private readonly valuesByNode = new Map<Node, NamedSchemaObject>();

    public tryReference(node: Node): NamedSchemaObject | null {
        const schema = this.valuesByNode.get(node);

        if (schema !== undefined) {
            schema.referenceCount++;
            return schema;
        }

        return null;
    }

    public addReference(schema: NamedSchemaObject): void {
        if (this.values.has(schema)) {
            throw new ParserError(
                schema.node,
                "Tried to add a reference to a schema that already exists in the database",
            );
        }

        this.values.add(schema);
        this.valuesByNode.set(schema.node, schema);
    }

    public useReference(schema: NamedSchemaObject): OAS.Reference | null {
        if (!this.values.has(schema)) {
            // After clearSingles() is called, schema objects with only one reference to them won't
            // exist here anymore.
            return null;
        }

        if (schema.referenceCount <= 0) {
            // Not strictly necessary, but if we're referencing more times in the schema than times
            // in the source code, it's generally a good indicator that something has gone wrong.
            throw new ParserError(
                schema.node,
                "Tried to use a reference a schema that has exhausted all its references",
            );
        }

        schema.referenceCount--;

        return { $ref: `#/components/schemas/${schema.getFullName()}` };
    }

    public clearSingles(): void {
        const keptSchemas: NamedSchemaObject[] = [];

        for (const value of this.values) {
            if (value.referenceCount > 1) {
                keptSchemas.push(value);
            }
        }

        this.values.clear();
        this.valuesByNode.clear();

        const schemasByName = new Map<string, NamedSchemaObject>();

        for (const schema of keptSchemas) {
            this.values.add(schema);

            const name = schema.getBaseName();

            const sameNamed = schemasByName.get(name);

            if (sameNamed !== undefined) {
                schema.discriminator = sameNamed.discriminator + 1;
            }

            schemasByName.set(name, schema);
        }
    }

    public toStringFull(): string {
        const output: string[] = [`SchemaReferenceDatabase(${this.values.size}):`];

        for (const value of this.values) {
            output.push(`\t${value.toStringShort()}`);
        }

        return output.join("\n");
    }

    public getAll(): Record<string, OAS.Schema> {
        const output: Record<string, OAS.Schema> = {};

        for (const schema of this.values) {
            output[schema.getFullName()] = schema.toSchema();
        }

        return output;
    }
}
