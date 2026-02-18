import type { TypeLiteralNode } from "typescript";
import { IdentifiedSchemaObject } from "@/schemas/base/IdentifiedSchemaObject";
import { SchemaObject, type ToIdentifiedArgs } from "@/schemas/base/SchemaObject";
import { compObject } from "../components/compObject";
import { CompProperties } from "../components/compProperties";
import { CompRequired } from "../components/compRequired";

class IdentifiedTypeLiteralNodeSchema extends IdentifiedSchemaObject {
    private readonly required: CompRequired;

    private readonly properties: CompProperties;

    public constructor(
        args: ToIdentifiedArgs,
        previous: IdentifiedTypeLiteralNodeSchema | null,
        required: CompRequired,
        properties: CompProperties,
    ) {
        super(args, previous, compObject, required, properties);
        this.required = required;
        this.properties = properties;
    }

    public override toIdentified(args: ToIdentifiedArgs): IdentifiedSchemaObject {
        return new IdentifiedTypeLiteralNodeSchema(args, this, this.required, this.properties);
    }

    public addRequiredKey(key: string, schema: SchemaObject): void {
        this.required.addKey(key);
        this.properties.addProperty(key, schema);
    }

    public addOptionalkey(key: string, schema: SchemaObject): void {
        this.properties.addProperty(key, schema);
    }
}

export class TypeLiteralNodeSchema extends SchemaObject {
    private readonly required: CompRequired;

    private readonly properties: CompProperties;

    public constructor(node: TypeLiteralNode) {
        const required = new CompRequired();
        const properties = new CompProperties();

        super(node, compObject, required, properties);

        this.required = required;
        this.properties = properties;
    }

    public override toIdentified(args: ToIdentifiedArgs): IdentifiedTypeLiteralNodeSchema {
        return new IdentifiedTypeLiteralNodeSchema(args, null, this.required, this.properties);
    }

    public addRequiredKey(key: string, schema: SchemaObject): void {
        this.required.addKey(key);
        this.properties.addProperty(key, schema);
    }

    public addOptionalkey(key: string, schema: SchemaObject): void {
        this.properties.addProperty(key, schema);
    }
}
