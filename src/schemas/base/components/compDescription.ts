import type { Node } from "typescript";
import { getJsDocDescription } from "@/jsDoc/getJsDocDescription";
import type { OAS } from "@/OAS";
import type { SchemaComponent } from "../SchemaComponent";

export class CompDescription implements SchemaComponent<unknown> {
    public readonly description: string[];

    public constructor(...description: string[]) {
        this.description = description;
    }

    public getName(): string {
        return "description";
    }

    public doSchemaActions(schema: OAS.Schema): void {
        if (this.description.length > 0) {
            schema.description = this.description.join("\n");
        }
    }

    public conflictsWith(other: SchemaComponent<unknown>): boolean {
        return other instanceof CompDescription;
    }

    public tryResolveConflictWith(other: this): CompDescription {
        return new CompDescription(...this.description, ...other.description);
    }
}

export function compDescription(node: Node): CompDescription | null {
    const description = getJsDocDescription(node);

    if (description !== null) {
        return new CompDescription(description);
    }

    return null;
}
