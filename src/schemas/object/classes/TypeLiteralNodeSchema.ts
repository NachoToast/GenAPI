import type { TypeLiteralNode } from "typescript";
import { SchemaObject } from "@/schemas/base/SchemaObject";
import type { AnyObject } from "@/types/AnyObject";
import { compObject } from "../components/compObject";
import { CompProperties } from "../components/compProperties";
import { CompRequired } from "../components/compRequired";

export class TypeLiteralNodeSchema extends SchemaObject<AnyObject> {
    public readonly requiredComp: CompRequired;

    public readonly propertiesComp: CompProperties;

    public constructor(node: TypeLiteralNode) {
        const requiredComp = new CompRequired();
        const propertiesComp = new CompProperties();

        super(node, [compObject, requiredComp, propertiesComp]);

        this.requiredComp = requiredComp;
        this.propertiesComp = propertiesComp;
    }
}
