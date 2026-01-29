import type { Identifier } from "typescript";
import type { ReferenceDatabase } from "@/classes/ReferenceDatabase";
import type { OAS } from "@/OAS";
import { type AnySupportedType, SchemaObject, type SchemaObjectArgs } from "./SchemaObject";

export abstract class NamedSchemaObject<
    T extends AnySupportedType = AnySupportedType,
> extends SchemaObject<T> {
    public referenceCount = 1;

    public discriminator = 0;

    private readonly identifier: Identifier;

    protected constructor(
        args: SchemaObjectArgs<T>,
        refDb: ReferenceDatabase,
        identifier: Identifier,
    ) {
        super(args, refDb);
        this.identifier = identifier;

        refDb.addReference(this);
    }

    public override toJson(): OAS.Schema | OAS.Reference {
        return this.refDb.useReference(this) ?? super.toJson();
    }

    public getBaseName(): string {
        return this.identifier.text;
    }

    public getFullName(): string {
        if (this.discriminator > 0) {
            return `${this.getBaseName()}#${this.discriminator}`;
        }

        return this.getBaseName();
    }

    protected override *getShortStringParts(): Generator<string> {
        yield* super.getShortStringParts();
        yield `ref:${this.referenceCount}`;

        if (this.discriminator > 0) {
            yield `#:${this.discriminator}`;
        }
    }

    protected override *getLongStringParts(): Generator<string> {
        yield* super.getLongStringParts();
        yield `Name: ${this.getFullName()}`;
        yield `Reference Count: ${this.referenceCount}`;
    }
}
