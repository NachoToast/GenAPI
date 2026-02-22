import type { EnumDeclaration, EnumMember } from "typescript";
import { getJsDocDescription } from "@/jsDoc/getJsDocDescription";
import { type CompEnum, compEnum } from "@/schemas/base/components/compEnum";
import type { SchemaDatabase } from "@/types/ReferenceDatabase";
import { CompDescription } from "../base/components/compDescription";
import { NamedSchemaObject } from "../base/NamedSchemaObject";

/** How to display an enum value in validation messages and the JSON `enum` field. */
function toStringFnComp(x: string | number): string {
    if (typeof x === "string") {
        return `"${x}"`;
    }

    return x.toString();
}

/** How to display an enum value in the JSON `description` field. */
function toStringFnDescription(x: string | number): string {
    if (typeof x === "string") {
        return `"${x}"`;
    }

    return x.toLocaleString();
}

export class EnumDeclarationSchema extends NamedSchemaObject<string | number> {
    private readonly enumComp: CompEnum<string | number>;

    public constructor(node: EnumDeclaration, schemaDb: SchemaDatabase) {
        const enumComp = compEnum<string | number>([], toStringFnComp);

        super({ node, baseName: node.name.text, schemaDb }, [enumComp]);

        this.enumComp = enumComp;
    }

    public addMember(member: EnumMember, value: string | number): void {
        this.enumComp.values.push(value);

        const description = getJsDocDescription(member);

        const key = member.name.getText();
        const valueStr = toStringFnDescription(value);

        let text: string;

        if (description !== null) {
            text = `- **${key}** = ${valueStr} - ${description}`;
        } else {
            text = `- **${key}** = ${valueStr}`;
        }

        this.addComponent(new CompDescription(text));
    }
}
