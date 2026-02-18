import { IdentifiedSchemaObject } from "@/schemas/base/IdentifiedSchemaObject";
import type { SchemaObject, ToIdentifiedArgs } from "@/schemas/base/SchemaObject";
import type { AnyObject } from "@/types/AnyObject";
import { compObject } from "../components/compObject";
import { CompProperties } from "../components/compProperties";
import { CompRequired } from "../components/compRequired";

/**
 * An extended identified schema object with additional methods to add properties to the
 * represented node.
 */
export class InterfaceDeclarationSchema extends IdentifiedSchemaObject<AnyObject> {
    private readonly required: CompRequired;

    private readonly properties: CompProperties;

    public constructor(args: ToIdentifiedArgs, previous: InterfaceDeclarationSchema | null) {
        const required = new CompRequired();
        const properties = new CompProperties();

        super(args, previous, compObject, required, properties);

        this.required = required;
        this.properties = properties;
    }

    public override toIdentified(args: ToIdentifiedArgs): IdentifiedSchemaObject<AnyObject> {
        return new InterfaceDeclarationSchema(args, this);
    }

    public addRequiredKey(key: string, schema: SchemaObject): void {
        this.required.addKey(key);
        this.properties.addProperty(key, schema);
    }

    public addOptionalkey(key: string, schema: SchemaObject): void {
        this.properties.addProperty(key, schema);
    }
}
