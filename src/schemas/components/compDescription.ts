import type { Node } from "typescript";
import { getJsDocDescription } from "@/jsDoc/getJsDocDescription";
import type { OAS } from "@/OAS";
import type { SchemaComponent } from "../base/SchemaComponent";

/** Sets the schema `description` field to the JSDoc comment on the given node. */
export class CompDescription implements SchemaComponent<unknown> {
    private readonly description: string;

    public constructor(description: string) {
        this.description = description;
    }

    public copyToIdentified(node: Node): SchemaComponent<unknown> {
        // TODO: see what concatenation looks like instead of replacement here?

        const description = getJsDocDescription(node);

        if (description !== null) {
            return new CompDescription(description);
        }

        return this;
    }

    public doSchemaActions(schema: OAS.Schema): void {
        schema.description = this.description;
    }
}

export const compDescription: SchemaComponent<unknown> = {
    copyToIdentified(node: Node): SchemaComponent<unknown> {
        const description = getJsDocDescription(node);

        if (description !== null) {
            return new CompDescription(description);
        }

        return this;
    },
};
