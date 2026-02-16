import type { OAS } from "@/OAS";
import type { SchemaComponent } from "../base/SchemaComponent";

export class CompExtraDescriptionParts implements SchemaComponent<unknown> {
    public joiner = "\n";

    public readonly parts: string[] = [];

    public copyToIdentified(): SchemaComponent<unknown> {
        return this;
    }

    public doSchemaActions(schema: OAS.Schema): void {
        if (this.parts.length === 0) return;

        if (schema.description !== undefined) {
            schema.description += this.joiner;
        }

        schema.description += this.parts.join(this.joiner);
    }
}
