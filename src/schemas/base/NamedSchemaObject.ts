import type { Node } from "typescript";
import { ParserError } from "@/errors/ParserError";
import type { OAS } from "@/OAS";
import type { SchemaDatabase } from "@/types/ReferenceDatabase";
import { addComponentTo } from "@/utils/addComponentTo";
import { compDescription } from "./components/compDescription";
import type { SchemaComponent } from "./SchemaComponent";
import { SchemaObject } from "./SchemaObject";

export interface NamedSchemaObjectArgs {
    node: Node;

    baseName: string;

    schemaDb: SchemaDatabase;
}

/**
 * Extension of a {@link SchemaObject}, specifically for nodes which can be identified by a name.
 *
 * This includes aliases, interfaces, property signatures, and enums.
 *
 * These may return a `$ref` object when being converted to JSON form.
 *
 * Because of their addressability, named schema objects often have more JSDoc components, like
 * **\@example** and descriptions.
 */
export class NamedSchemaObject<T> extends SchemaObject<T> {
    public referenceCount = 1;

    public discriminator = 0;

    public readonly baseName: string;

    private readonly schemaDb: SchemaDatabase;

    private readonly mutableComponentsRef: SchemaComponent<T>[];

    public constructor(args: NamedSchemaObjectArgs, components: SchemaComponent<T>[]) {
        const { node, baseName, schemaDb } = args;

        super(node, components);

        this.baseName = baseName;
        this.schemaDb = schemaDb;
        this.mutableComponentsRef = components;

        this.schemaDb.set(node, this);

        for (const component of this.getExtraComponents(node)) {
            if (component !== null) {
                this.addComponent(component);
            }
        }
    }

    public override toNamed(): NamedSchemaObject<T> {
        return this;
    }

    public override toJson(): OAS.Schema | OAS.Reference {
        if (!this.schemaDb.has(this.node)) {
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

    public getFullName(): string {
        if (this.discriminator > 0) {
            return `${this.baseName}#${this.discriminator}`;
        }

        return this.baseName;
    }

    public addComponent(component: SchemaComponent<T>): void {
        addComponentTo(this.mutableComponentsRef, component);
    }

    protected *getExtraComponents(node: Node): Generator<SchemaComponent<T> | null> {
        yield compDescription(node);
    }

    protected override *getShortStringParts(): Generator<string> {
        yield* super.getShortStringParts();
        yield `ref:${this.referenceCount}`;
    }

    protected override *getLongStringParts(): Generator<string> {
        yield* super.getLongStringParts();
        yield `Name: ${this.getFullName()}`;
        yield `Reference Count: ${this.referenceCount}`;
    }
}
