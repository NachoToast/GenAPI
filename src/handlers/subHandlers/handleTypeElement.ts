import {
    isIdentifier,
    isNoSubstitutionTemplateLiteral,
    isPrivateIdentifier,
    isPropertySignature,
    isStringLiteral,
    type TypeElement,
} from "typescript";
import { ParserError } from "@/errors/ParserError";
import type { AnySchemaObject } from "@/schemas/base/SchemaObject";
import type { HandlerArgs } from "@/types/HandlerArgs";
import { handleNode } from "../handleNode";

interface MemberInfo {
    key: string;

    value: AnySchemaObject;
}

export function handleTypeElement(member: TypeElement, args: HandlerArgs): MemberInfo | null {
    if (!isPropertySignature(member)) {
        throw new ParserError(member, "Expected a PropertySignature node");
    }

    if (member.type === undefined) {
        throw new ParserError(member, "Encountered a PropertySignature node with no type");
    }

    const schema = handleNode(member.type, args);

    if (schema === null) {
        return null;
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

    return {
        key: member.name.text,
        value: schema.toNamed({
            node: member,
            baseName: member.name.text,
            schemaDb: args.schemaDb,
        }),
    };
}
