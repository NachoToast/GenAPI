import {
    isIdentifier,
    isNoSubstitutionTemplateLiteral,
    isPrivateIdentifier,
    isPropertySignature,
    isStringLiteral,
    type TypeLiteralNode,
} from "typescript";
import { ParserError } from "@/errors/ParserError";
import type { SchemaObject } from "@/schemas/base/SchemaObject";
import { TypeLiteralNodeSchema } from "@/schemas/object/classes/TypeLiteralNodeSchema";
import type { HandlerArgs } from "@/types/HandlerArgs";
import { handleNode } from "./handleNode";

export function handleTypeLiteralNode(node: TypeLiteralNode, args: HandlerArgs): SchemaObject {
    const root = new TypeLiteralNodeSchema(node);

    for (const member of node.members) {
        if (!isPropertySignature(member)) {
            throw new ParserError(member, "Expected a PropertySignature node");
        }

        if (member.type === undefined) {
            throw new ParserError(member, "Encountered a PropertySignature node with no type");
        }

        const schema = handleNode(member.type, args);

        if (schema === null) {
            continue;
        }

        if (
            !(
                isIdentifier(member.name) ||
                isStringLiteral(member.name) ||
                isNoSubstitutionTemplateLiteral(member.name) ||
                isPrivateIdentifier(member.name)
            )
        ) {
            throw new ParserError(member.name, "Only string object keys are supported");
        }

        const key = member.name.text;

        if (member.questionToken === undefined) {
            root.addRequiredKey(key, schema);
        } else {
            root.addOptionalkey(key, schema);
        }
    }

    return root;
}
