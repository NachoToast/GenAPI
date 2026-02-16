import type { Identifier, Node } from "typescript";
import { ParserError } from "@/errors/ParserError";
import type { OAS } from "@/OAS";
import type { ReferenceDatabase } from "@/types/ReferenceDatabase";
import { getNodeLocation } from "@/utils/getNodeLocation";
import type { SchemaComponent } from "./SchemaComponent";
import { SchemaObject } from "./SchemaObject";

/**
 * A schema object representation that is identified by another node in the AST tree, such as a
 * type alias declaration or property signature.
 *
 * Depending on the number of times they are referenced, these objects may instead return a `$ref`
 * when being converted to JSON.
 */
// biome-ignore lint/suspicious/noExplicitAny: unknown doesn't work here
export class IdentifiedSchemaObject<T = any> extends SchemaObject<T> {
    public referenceCount = 1;

    public discriminator = 0;

    private readonly identifier: Identifier;

    public constructor(
        node: Node,
        refDb: ReferenceDatabase,
        identifier: Identifier,
        ...components: ReadonlyArray<SchemaComponent<T>>
    ) {
        super(node, refDb, ...components.map((x) => x.copyToIdentified(node)));

        this.identifier = identifier;

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
                "Tried to use a reference a schema that has exhausted all its references",
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
}
