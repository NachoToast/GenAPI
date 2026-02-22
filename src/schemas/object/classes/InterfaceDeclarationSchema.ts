import type { InterfaceDeclaration } from "typescript";
import { NamedSchemaObject } from "@/schemas/base/NamedSchemaObject";
import type { AnyObject } from "@/types/AnyObject";
import type { SchemaDatabase } from "@/types/ReferenceDatabase";
import { compObject } from "../components/compObject";
import { CompProperties } from "../components/compProperties";
import { CompRequired } from "../components/compRequired";

export class InterfaceDeclarationSchema extends NamedSchemaObject<AnyObject> {
    public readonly requiredComp: CompRequired;

    public readonly propertiesComp: CompProperties;

    public constructor(node: InterfaceDeclaration, schemaDb: SchemaDatabase) {
        const requiredComp = new CompRequired();
        const propertiesComp = new CompProperties();

        super({ node, baseName: node.name.text, schemaDb }, [
            compObject,
            requiredComp,
            propertiesComp,
        ]);

        this.requiredComp = requiredComp;
        this.propertiesComp = propertiesComp;
    }
}
