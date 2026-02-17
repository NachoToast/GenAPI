import type { Identifier } from "typescript";
import { ParserError } from "@/errors/ParserError";
import type { OAS } from "@/OAS";
import type { ReferenceDatabase } from "@/types/ReferenceDatabase";
import { getNodeLocation } from "@/utils/getNodeLocation";
import { CompDescription, compDescription } from "./components/compDescription";
import type { SchemaComponent } from "./SchemaComponent";
import { SchemaObject, type ToIdentifiedArgs } from "./SchemaObject";

/**
 * A schema object representation that is identified by another node in the AST tree, such as a
 * type alias declaration or property signature.
 *
 * Depending on the number of times they are referenced, these objects may instead return a `$ref`
 * when being converted to JSON.
 */

// biome-ignore lint/suspicious/noExplicitAny: unknown doesn't work here
export abstract class IdentifiedSchemaObject<T = any> extends SchemaObject<T> {
    public referenceCount = 1;

    public discriminator = 0;

    private description: CompDescription | null;

    private readonly refDb: ReferenceDatabase;

    private readonly identifier: Identifier;

    protected constructor(
        { node, identifier, refDb }: ToIdentifiedArgs,
        previous: IdentifiedSchemaObject<T> | null,
        ...components: ReadonlyArray<SchemaComponent<T> | null>
    ) {
        const description = compDescription(node);

        const finalComponents: SchemaComponent<T>[] = [description, ...components].filter(
            (x) => x !== null,
        );

        if (previous !== null) {
            const copyFns: ((other: SchemaComponent<T>) => void)[] = [];

            for (const component of finalComponents) {
                if (component.doCopyFrom !== undefined) {
                    // todo: test necessity of .bind here
                    copyFns.push(component.doCopyFrom.bind(component));
                }
            }

            if (copyFns.length > 0) {
                try {
                    for (const prevComponent of previous.components) {
                        for (const fn of copyFns) {
                            fn(prevComponent);
                        }
                    }
                } catch (error) {
                    if (!(error instanceof Error)) {
                        throw error;
                    }

                    throw new ParserError(node, error.message);
                }
            }
        }

        super(node, ...finalComponents);
        this.refDb = refDb;
        this.identifier = identifier;
        this.description = description;

        refDb.set(node, this);
    }

    public override toJson(): OAS.Schema | OAS.Reference {
        if (!this.refDb.has(this.node)) {
            return this.toSchema();
        }

        if (this.referenceCount <= 0) {
            // Not strictly necessary, but if we're referencing more times in the schema than times
            // in the source code, it's generally a good indicator that something has gone wrong.
            throw new ParserError(
                this.node,
                "Tried to reference a schema that has exhausted all of its references",
            );
        }

        this.referenceCount--;

        return { $ref: `#/components/schemas/${this.getFullName()}` };
    }

    public getBaseName(): string {
        return this.identifier.text;
    }

    public getFullName(): string {
        const baseName = this.getBaseName();

        if (this.discriminator > 0) {
            return `${baseName}#${this.discriminator}`;
        }

        return baseName;
    }

    protected override *getShortStringParts(): Generator<string> {
        yield* super.getShortStringParts();
        yield `ref:${this.referenceCount}`;
    }

    protected override *getLongStringParts(): Generator<string> {
        yield* super.getLongStringParts();
        yield `Name: ${this.getFullName()}`;
        yield `Identifier: ${getNodeLocation(this.identifier)}`;
        yield `Reference Count: ${this.referenceCount}`;
    }

    protected addToDescription(text: string): void {
        if (this.description === null) {
            this.description = new CompDescription(text);
        } else {
            this.description.addPart(text);
        }
    }
}
