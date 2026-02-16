import type { EnumDeclaration, EnumMember } from "typescript";
import { getJsDocDescription } from "@/jsDoc/getJsDocDescription";
import { IdentifiedSchemaObject } from "@/schemas/base/IdentifiedSchemaObject";
import type { ReferenceDatabase } from "@/types/ReferenceDatabase";
import { compDescription } from "../components/compDescription";
import { CompEnum } from "../components/compEnum";
import { CompExtraDescriptionParts } from "../components/compExtraDescriptionParts";

function toStringFn(x: string | number): string {
    if (typeof x === "string") {
        return `"${x}"`;
    }

    return x.toString();
}

/**
 * An extended identified schema object with an additional method to add values to the represented
 * node.
 */
export class EnumDeclarationSchema extends IdentifiedSchemaObject {
    private readonly enum: CompEnum<string | number>;

    private readonly extraDescription: CompExtraDescriptionParts;

    public constructor(node: EnumDeclaration, refDb: ReferenceDatabase) {
        const enumComp = new CompEnum<string | number>([], toStringFn);
        const extraDescription = new CompExtraDescriptionParts();

        super(node, refDb, node.name, compDescription, extraDescription, enumComp);

        this.enum = enumComp;
        this.extraDescription = extraDescription;
    }
    public addMember(member: EnumMember, value: string | number): void {
        const subDescription = getJsDocDescription(member);

        const subName = member.name.getText();

        this.enum.addValue(value);

        const valueStr = typeof value === "string" ? `"${value}"` : value.toLocaleString();

        if (subDescription !== null) {
            this.extraDescription.parts.push(`- **${subName}** = ${valueStr} - ${subDescription}`);
        } else {
            this.extraDescription.parts.push(`- **${subName}** = ${valueStr}`);
        }
    }
}
