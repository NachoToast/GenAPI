import {
    isLiteralTypeNode,
    isNumericLiteral,
    isStringLiteral,
    type Node,
    type PropertySignature,
    SyntaxKind,
} from "typescript";
import { ParserError } from "@/errors/ParserError";
import { PropertyNumberKeywordSchema } from "@/schemas/number/PropertyNumberKeywordSchema";
import { PropertyNumberLiteralSchema } from "@/schemas/number/PropertyNumberLiteralSchema";
import type { SchemaObject } from "@/schemas/SchemaObject";
import { PropertyStringKeywordSchema } from "@/schemas/string/PropertyStringKeywordSchema";
import { PropertyStringLiteralSchema } from "@/schemas/string/PropertyStringLiteralSchema";
import type { HandlerArgs } from "@/types/HandlerArgs";

export function handlePropertySignature(
    node: PropertySignature,
    args: HandlerArgs,
): SchemaObject | null {
    if (node.type === undefined) {
        throw new ParserError(node, "Encountered a property signature with no explicit type");
    }

    let value: Node;

    if (isLiteralTypeNode(node.type)) {
        value = node.type.literal;
    } else {
        value = node.type;
    }

    switch (value.kind) {
        case SyntaxKind.StringKeyword:
            return new PropertyStringKeywordSchema(node, args.refDb);

        case SyntaxKind.NumberKeyword:
            return new PropertyNumberKeywordSchema(node, args.refDb);
    }

    if (isStringLiteral(value)) {
        return new PropertyStringLiteralSchema(node, args.refDb, value.text);
    }

    if (isNumericLiteral(value)) {
        return new PropertyNumberLiteralSchema(node, args.refDb, Number(value.text));
    }

    return args.handleNode(value, args);
}
