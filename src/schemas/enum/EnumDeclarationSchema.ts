import type { EnumMember } from "typescript";
import { getJsDocDescription } from "@/jsDoc/getJsDocDescription";
import { type CompEnum, compEnum } from "@/schemas/base/components/compEnum";
import { IdentifiedSchemaObject } from "@/schemas/base/IdentifiedSchemaObject";
import type { ToIdentifiedArgs } from "@/schemas/base/SchemaObject";

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
export class EnumDeclarationSchema extends IdentifiedSchemaObject<string | number> {
    private readonly enum: CompEnum<string | number>;

    public constructor(args: ToIdentifiedArgs, previous: EnumDeclarationSchema | null) {
        const enumComp = compEnum<string | number>([], toStringFn);

        super(args, previous, enumComp);

        this.enum = enumComp;
    }

    public override toIdentified(args: ToIdentifiedArgs): IdentifiedSchemaObject<string | number> {
        return new EnumDeclarationSchema(args, this);
    }

    public addMember(member: EnumMember, value: string | number): void {
        const subDescription = getJsDocDescription(member);

        const subName = member.name.getText();

        this.enum.addValue(value);

        const valueStr = typeof value === "string" ? `"${value}"` : value.toLocaleString();

        if (subDescription !== null) {
            this.addToDescription(`- **${subName}** = ${valueStr} - ${subDescription}`);
        } else {
            this.addToDescription(`- **${subName}** = ${valueStr}`);
        }
    }
}
