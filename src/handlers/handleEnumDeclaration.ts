import type { EnumDeclaration } from "typescript";
import { ParserError } from "@/errors/ParserError";
import { EnumDeclarationSchema } from "@/schemas/enum/EnumDeclarationSchema";
import type { HandlerArgs } from "@/types/HandlerArgs";

export function handleEnumDeclaration(
    node: EnumDeclaration,
    args: HandlerArgs,
): EnumDeclarationSchema {
    const root = new EnumDeclarationSchema(node, args.schemaDb);

    for (const member of node.members) {
        if (member.initializer === undefined) {
            throw new ParserError(member, "Encountered an EnumMember node with no initializer");
        }

        const value = args.typeChecker.getConstantValue(member);

        if (value === undefined) {
            throw new ParserError(member, "Encountered an EnumMember node with no value");
        }

        root.addMember(member, value);
    }

    return root;
}
