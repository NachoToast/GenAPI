import type { TypeLiteralNode } from "typescript";
import type { AnySchemaObject } from "@/schemas/base/SchemaObject";
import { TypeLiteralNodeSchema } from "@/schemas/object/classes/TypeLiteralNodeSchema";
import type { HandlerArgs } from "@/types/HandlerArgs";
import { handleTypeElement } from "./subHandlers/handleTypeElement";

export function handleTypeLiteralNode(node: TypeLiteralNode, args: HandlerArgs): AnySchemaObject {
    const root = new TypeLiteralNodeSchema(node);

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
