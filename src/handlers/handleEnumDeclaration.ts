import type { EnumDeclaration } from "typescript";
import { ParserError } from "@/errors/ParserError";
import type { SchemaObject } from "@/schemas/base/SchemaObject";
import { EnumDeclarationSchema } from "@/schemas/classes/EnumDeclarationSchema";
import type { HandlerArgs } from "@/types/HandlerArgs";

export function handleEnumDeclaration(node: EnumDeclaration, args: HandlerArgs): SchemaObject {
    const root = new EnumDeclarationSchema(node, args.refDb);

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
