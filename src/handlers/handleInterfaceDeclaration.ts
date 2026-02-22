import type { InterfaceDeclaration } from "typescript";
import type { AnySchemaObject } from "@/schemas/base/SchemaObject";
import { InterfaceDeclarationSchema } from "@/schemas/object/classes/InterfaceDeclarationSchema";
import type { HandlerArgs } from "@/types/HandlerArgs";
import { handleTypeElement } from "./subHandlers/handleTypeElement";

export function handleInterfaceDeclaration(
    node: InterfaceDeclaration,
    args: HandlerArgs,
): AnySchemaObject {
    const root = new InterfaceDeclarationSchema(node, args.schemaDb);

    for (const member of node.members) {
        const memberInfo = handleTypeElement(member, args);

        if (memberInfo === null) {
            continue;
        }

        root.propertiesComp.addProperty(memberInfo.key, memberInfo.value);

        if (member.questionToken === undefined) {
            root.requiredComp.addKey(memberInfo.key);
        }
    }

    return root;
}
