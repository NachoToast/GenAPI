import type { Node } from "typescript";
import { getJsDocDescription } from "@/jsDoc/getJsDocDescription";
import type { OAS } from "@/OAS";
import type { SchemaComponent } from "../SchemaComponent";

/** Sets the schema `description` field to the JSDoc comment on the given node. */
export class CompDescription implements SchemaComponent<unknown> {
    private readonly description: string[];

    public constructor(description: string) {
        this.description = [description];
    }

    public doSchemaActions(schema: OAS.Schema): void {
        schema.description = this.description.join("\n");
    }

    public doCopyFrom(other: SchemaComponent<unknown>): void {
        if (other instanceof CompDescription && other.description.length > 0) {
            // double newline between descriptions to help distinguish them
            this.description.unshift(
                ...other.description.slice(0, -1),
                `${other.description.slice(-1)[0]}\n`,
            );
        }
    }

    public addPart(text: string): void {
        this.description.push(text);
    }
}

export function compDescription(node: Node): CompDescription | null {
    const description = getJsDocDescription(node);

    if (description !== null) {
        return new CompDescription(description);
    }

    return null;
}
