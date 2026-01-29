import {
    isInterfaceDeclaration,
    isLiteralTypeNode,
    isNumericLiteral,
    isPropertySignature,
    isStringLiteral,
    isTypeAliasDeclaration,
    isTypeReferenceNode,
    type Node,
    SyntaxKind,
} from "typescript";
import { getReferencedType } from "@/helpers/getReferencedType";
import { getSource } from "@/helpers/getSource";
import { NumberKeywordSchema } from "@/schemas/number/NumberKeywordSchema";
import { NumberLiteralSchema } from "@/schemas/number/NumberLiteralSchema";
import type { SchemaObject } from "@/schemas/SchemaObject";
import { StringKeywordSchema } from "@/schemas/string/StringKeywordSchema";
import { StringLiteralSchema } from "@/schemas/string/StringLiteralSchema";
import type { HandlerArgs } from "@/types/HandlerArgs";
import { handleInterfaceDeclaration } from "./handleInterfaceDeclaration";
import { handlePropertySignature } from "./handlePropertySignature";
import { handleTypeAliasDeclaration } from "./handleTypeAliasDeclaration";

function logNotSupported(node: Node): void {
    console.log(
        getSource(node),
        `Handler for node kind ${SyntaxKind[node.kind]} is not yet implemented`,
    );
}

export function handleNode(node: Node, args: HandlerArgs): SchemaObject | null {
    const asRef = args.refDb.tryReference(node);

    if (asRef !== null) {
        // console.log(`Reference hit! ${getSource(node)} is ${asRef.toStringShort()} `);
        return asRef;
    }

    switch (node.kind) {
        case SyntaxKind.AnyKeyword:
        case SyntaxKind.NeverKeyword:
        case SyntaxKind.UndefinedKeyword:
        case SyntaxKind.UnknownKeyword:
        case SyntaxKind.VoidKeyword:
            return null;
        case SyntaxKind.NumberKeyword:
            return new NumberKeywordSchema(node, args.refDb);
        case SyntaxKind.StringKeyword:
            return new StringKeywordSchema(node, args.refDb);
    }

    if (isTypeReferenceNode(node)) {
        return handleNode(getReferencedType(node, args.typeChecker), args);
    }

    if (isTypeAliasDeclaration(node)) {
        return handleTypeAliasDeclaration(node, args);
    }

    if (isInterfaceDeclaration(node)) {
        return handleInterfaceDeclaration(node, args);
    }

    if (isPropertySignature(node)) {
        return handlePropertySignature(node, args);
    }

    if (isLiteralTypeNode(node)) {
        return handleNode(node.literal, args);
    }

    if (isStringLiteral(node)) {
        return new StringLiteralSchema(node, args.refDb, node.text);
    }

    if (isNumericLiteral(node)) {
        return new NumberLiteralSchema(node, args.refDb, Number(node.text));
    }

    logNotSupported(node);
    return null;
    // throw new ParserError(node, `Unsure how to handle node of kind ${SyntaxKind[node.kind]}`);
}
