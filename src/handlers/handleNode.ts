import {
    isEnumDeclaration,
    isInterfaceDeclaration,
    isLiteralTypeNode,
    isNumericLiteral,
    isStringLiteral,
    isTypeAliasDeclaration,
    isTypeLiteralNode,
    isTypeReferenceNode,
    isUnionTypeNode,
    type Node,
    SyntaxKind,
} from "typescript";
import { ParserError } from "@/errors/ParserError";
import { getReferencedType } from "@/helpers/getReferencedType";
import type { SchemaObject } from "@/schemas/base/SchemaObject";
import { BooleanKeywordSchema } from "@/schemas/boolean/classes/BooleanKeywordSchema";
import { BooleanLiteralSchema } from "@/schemas/boolean/classes/BooleanLiteralSchema";
import { NullKeywordSchema } from "@/schemas/null/classes/NullKeywordSchema";
import { NumberKeywordSchema } from "@/schemas/number/classes/NumberKeywordSchema";
import { NumberLiteralSchema } from "@/schemas/number/classes/NumberLiteralSchema";
import { StringKeywordSchema } from "@/schemas/string/classes/StringKeywordSchema";
import { StringLiteralSchema } from "@/schemas/string/classes/StringLiteralSchema";
import { UndefinedKeywordSchema } from "@/schemas/undefined/classes/UndefinedKeywordSchema";
import { UnknownKeywordSchema } from "@/schemas/unknown/classes/UnknownKeywordSchema";
import type { HandlerArgs } from "@/types/HandlerArgs";
import { handleEnumDeclaration } from "./handleEnumDeclaration";
import { handleInterfaceDeclaration } from "./handleInterfaceDeclaration";
import { handleTypeAliasDeclaration } from "./handleTypeAliasDeclaration";
import { handleTypeLiteralNode } from "./handleTypeLiteralNode";
import { handleUnionTypeNode } from "./handleUnionTypeNode";

function handleNodeInternal(node: Node, args: HandlerArgs): SchemaObject | null {
    const asRef = args.refDb.get(node);

    if (asRef !== undefined) {
        asRef.referenceCount++;
        return asRef;
    }

    switch (node.kind) {
        case SyntaxKind.AnyKeyword:
            return new StringKeywordSchema(node);
        case SyntaxKind.UnknownKeyword:
            return new UnknownKeywordSchema(node);
        case SyntaxKind.UndefinedKeyword:
            return new UndefinedKeywordSchema(node);
        case SyntaxKind.NeverKeyword:
        case SyntaxKind.VoidKeyword:
            return null;
        case SyntaxKind.NullKeyword:
            return new NullKeywordSchema(node);
        case SyntaxKind.StringKeyword:
            return new StringKeywordSchema(node);
        case SyntaxKind.NumberKeyword:
            return new NumberKeywordSchema(node);
        case SyntaxKind.BooleanKeyword:
            return new BooleanKeywordSchema(node);
        case SyntaxKind.TrueKeyword:
            return new BooleanLiteralSchema(node, true);
        case SyntaxKind.FalseKeyword:
            return new BooleanLiteralSchema(node, false);
    }

    if (isTypeReferenceNode(node)) {
        return handleNodeInternal(getReferencedType(node, args.typeChecker), args);
    }

    if (isTypeAliasDeclaration(node)) {
        return handleTypeAliasDeclaration(node, args);
    }

    if (isInterfaceDeclaration(node)) {
        return handleInterfaceDeclaration(node, args);
    }

    if (isLiteralTypeNode(node)) {
        return handleNodeInternal(node.literal, args);
    }

    if (isStringLiteral(node)) {
        return new StringLiteralSchema(node);
    }

    if (isNumericLiteral(node)) {
        return new NumberLiteralSchema(node);
    }

    if (isUnionTypeNode(node)) {
        return handleUnionTypeNode(node, args);
    }

    if (isEnumDeclaration(node)) {
        return handleEnumDeclaration(node, args);
    }

    if (isTypeLiteralNode(node)) {
        return handleTypeLiteralNode(node, args);
    }

    throw new ParserError(node, "Unsure how to handle a node of this kind");
}

/**
 * Converts a {@link node} to a {@link SchemaObject}.
 *
 * Note that **all** instantiated schema objects **must** originate from this function so that
 * post-instantiation logic can occur.
 */
export function handleNode(node: Node, args: HandlerArgs): SchemaObject | null {
    try {
        const schemaObject = handleNodeInternal(node, args);

        schemaObject?.doPostInitActions();

        return schemaObject;
    } catch (error) {
        if (!(error instanceof ParserError)) {
            throw error;
        }

        console.log(error.makeChild());
        return null;
    }
}
