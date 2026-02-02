import {
    isLiteralTypeNode,
    isNumericLiteral,
    isStringLiteral,
    type Node,
    SyntaxKind,
    type TypeAliasDeclaration,
} from "typescript";
import { AliasedNumberKeywordSchema } from "@/schemas/number/AliasedNumberKeywordSchema";
import { AliasedNumberLiteralSchema } from "@/schemas/number/AliasedNumberLiteralSchema";
import type { SchemaObject } from "@/schemas/SchemaObject";
import { AliasedStringKeywordSchema } from "@/schemas/string/AliasedStringKeywordSchema";
import { AliasedStringLiteralSchema } from "@/schemas/string/AliasedStringLiteralSchema";
import type { HandlerArgs } from "@/types/HandlerArgs";
import { handleNode } from "./handleNode";

export function handleTypeAliasDeclaration(
    node: TypeAliasDeclaration,
    args: HandlerArgs,
): SchemaObject | null {
    let value: Node;

    if (isLiteralTypeNode(node.type)) {
        value = node.type.literal;
    } else {
        value = node.type;
    }

    switch (value.kind) {
        case SyntaxKind.StringKeyword:
            return new AliasedStringKeywordSchema(node, args.refDb);

        case SyntaxKind.NumberKeyword:
            return new AliasedNumberKeywordSchema(node, args.refDb);
    }

    if (isStringLiteral(value)) {
        return new AliasedStringLiteralSchema(node, args.refDb, value.text);
    }

    if (isNumericLiteral(value)) {
        return new AliasedNumberLiteralSchema(node, args.refDb, Number(value.text));
    }

    return handleNode(value, args);
}
