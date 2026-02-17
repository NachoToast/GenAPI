import type { UnionTypeNode } from "typescript";
import type { OAS } from "@/OAS";
import { IdentifiedSchemaObject } from "@/schemas/base/IdentifiedSchemaObject";
import { SchemaObject, type ToIdentifiedArgs } from "@/schemas/base/SchemaObject";
import type { FinalValidationFn } from "@/types/ValidationFns";
import { makeUnionValidator } from "../utils/unionValidatorUtils";

class IdentifiedUnionTypeNodeSchema extends IdentifiedSchemaObject {
    private readonly schemas: SchemaObject[];

    public constructor(
        args: ToIdentifiedArgs,
        previous: IdentifiedUnionTypeNodeSchema | null,
        schemas: SchemaObject[],
    ) {
        super(args, previous);
        this.schemas = schemas;
    }

    public override makeValidator(): FinalValidationFn {
        return makeUnionValidator(this.schemas);
    }
    public override toSchema(): OAS.Schema {
        const output = super.toSchema();

        output.oneOf = this.schemas.map((x) => x.toJson());

        return output;
    }

    public override toIdentified(args: ToIdentifiedArgs): IdentifiedSchemaObject {
        return new IdentifiedUnionTypeNodeSchema(args, this, this.schemas);
    }

    protected override *getShortStringParts(): Generator<string> {
        yield* super.getShortStringParts();
        yield `schemas:${this.schemas.length}`;
    }

    protected override *getLongStringParts(): Generator<string> {
        yield* super.getLongStringParts();
        yield `Schemas (${this.schemas.length}): ${this.schemas.map((x) => x.toStringShort()).join(", ")}`;
    }
}

/**
 * An extended schema object with an additional method to add sub-schemas to the represented node.
 */
export class UnionTypeNodeSchema extends SchemaObject {
    private readonly schemas: SchemaObject[] = [];

    public constructor(node: UnionTypeNode) {
        super(node);
    }

    public override makeValidator(): FinalValidationFn {
        return makeUnionValidator(this.schemas);
    }

    public override toSchema(): OAS.Schema {
        const output = super.toSchema();

        output.oneOf = this.schemas.map((x) => x.toJson());

        return output;
    }

    public override toIdentified(args: ToIdentifiedArgs): IdentifiedSchemaObject {
        return new IdentifiedUnionTypeNodeSchema(args, null, this.schemas);
    }

    public addSchemas(schemas: SchemaObject[]): void {
        this.schemas.push(...schemas);
    }

    protected override *getShortStringParts(): Generator<string> {
        yield* super.getShortStringParts();
        yield `schemas:${this.schemas.length}`;
    }

    protected override *getLongStringParts(): Generator<string> {
        yield* super.getLongStringParts();
        yield `Schemas (${this.schemas.length}): ${this.schemas.map((x) => x.toStringShort()).join(", ")}`;
    }
}
