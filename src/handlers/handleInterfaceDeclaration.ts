import { type InterfaceDeclaration, isIdentifier, isPropertySignature } from "typescript";
import { ParserError } from "@/errors/ParserError";
import { InterfaceDeclarationSchema } from "@/schemas/object/InterfaceDeclarationSchema";
import type { HandlerArgs } from "@/types/HandlerArgs";

export function handleInterfaceDeclaration(
    node: InterfaceDeclaration,
    args: HandlerArgs,
): InterfaceDeclarationSchema {
    const root = new InterfaceDeclarationSchema(node, args.refDb);

    for (const member of node.members) {
        if (!isPropertySignature(member)) {
            continue;
        }

        if (!isIdentifier(member.name)) {
            throw new ParserError(member, "Expected all keys of interface to be identifiers");
        }

        const value = args.handleNode(member, args);

        if (value === null) {
            continue;
        }

        root.addProperty(member.name.text, value);
    }

    return root;
}
