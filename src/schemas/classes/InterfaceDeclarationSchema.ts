import type { InterfaceDeclaration } from "typescript";
import { IdentifiedSchemaObject } from "@/schemas/base/IdentifiedSchemaObject";
import type { SchemaObject } from "@/schemas/base/SchemaObject";
import type { AnyObject } from "@/types/AnyObject";
import type { ReferenceDatabase } from "@/types/ReferenceDatabase";
import { compDescription } from "../components/compDescription";
import { CompProperties } from "../components/compProperties";
import { CompRequired } from "../components/compRequired";
import { compTypeObject } from "../components/compTypeObject";

/**
 * An extended identified schema object with additional methods to add properties to the
 * represented node.
 */
export class InterfaceDeclarationSchema extends IdentifiedSchemaObject<AnyObject> {
    private readonly requiredKeys: CompRequired;

    private readonly properties: CompProperties;

    public constructor(node: InterfaceDeclaration, refDb: ReferenceDatabase) {
        const requiredKeys = new CompRequired();
        const properties = new CompProperties();

        super(
            node,
            refDb,
            node.name,
            compTypeObject,
            compDescription.copyToIdentified(node),
            requiredKeys,
            properties,
        );

        this.requiredKeys = requiredKeys;
        this.properties = properties;
    }

    public addRequiredKey(key: string, schema: SchemaObject<unknown>): void {
        this.requiredKeys.addKey(key);
        this.properties.addProperty(key, schema);
    }

    public addOptionalkey(key: string, schema: SchemaObject<unknown>): void {
        this.properties.addProperty(key, schema);
    }
}
