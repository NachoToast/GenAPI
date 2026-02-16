import {
    isEnumDeclaration,
    isInterfaceDeclaration,
    isLiteralTypeNode,
    isNumericLiteral,
    isStringLiteral,
    isTypeAliasDeclaration,
    isTypeReferenceNode,
    isUnionTypeNode,
    type Node,
    SyntaxKind,
} from "typescript";
import { ParserError } from "@/errors/ParserError";
import { getReferencedType } from "@/helpers/getReferencedType";
import { SchemaObject } from "@/schemas/base/SchemaObject";
import { booleanKeywordSchema, booleanLiteralSchema } from "@/schemas/boolean";
import { compDescription } from "@/schemas/components/compDescription";
import { compTypeAny } from "@/schemas/components/compTypeAny";
import { compTypeNull } from "@/schemas/components/compTypeNull";
import { compTypeUndefined } from "@/schemas/components/compTypeUndefined";
import { compTypeUnknown } from "@/schemas/components/compTypeUnknown";
import { numberKeywordSchema, numberLiteralSchema } from "@/schemas/number";
import { stringKeywordSchema, stringLiteralSchema } from "@/schemas/string";
import type { HandlerArgs } from "@/types/HandlerArgs";
import { handleEnumDeclaration } from "./handleEnumDeclaration";
import { handleInterfaceDeclaration } from "./handleInterfaceDeclaration";
import { handleTypeAliasDeclaration } from "./handleTypeAliasDeclaration";
import { handleUnionTypeNode } from "./handleUnionTypeNode";

function handleNodeInternal(node: Node, args: HandlerArgs): SchemaObject | null {
    const asRef = args.refDb.get(node);

    if (asRef !== undefined) {
        asRef.referenceCount++;
        return asRef;
    }

    const { refDb, typeChecker } = args;

    switch (node.kind) {
        case SyntaxKind.AnyKeyword:
            return new SchemaObject(node, refDb, compTypeAny, compDescription);
        case SyntaxKind.UnknownKeyword:
            return new SchemaObject(node, refDb, compTypeUnknown, compDescription);
        case SyntaxKind.UndefinedKeyword:
            return new SchemaObject(node, refDb, compTypeUndefined, compDescription);
        case SyntaxKind.NeverKeyword:
        case SyntaxKind.VoidKeyword:
            return null;
        case SyntaxKind.NullKeyword:
            return new SchemaObject(node, refDb, compTypeNull, compDescription);
        case SyntaxKind.StringKeyword:
            return stringKeywordSchema(node, refDb);
        case SyntaxKind.NumberKeyword:
            return numberKeywordSchema(node, refDb);
        case SyntaxKind.BooleanKeyword:
            return booleanKeywordSchema(node, refDb);
        case SyntaxKind.TrueKeyword:
            return booleanLiteralSchema(node, refDb, [true]);
        case SyntaxKind.FalseKeyword:
            return booleanLiteralSchema(node, refDb, [false]);
    }

    if (isTypeReferenceNode(node)) {
        return handleNodeInternal(getReferencedType(node, typeChecker), args);
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
        return stringLiteralSchema(node, refDb, [node.text]);
    }

    if (isNumericLiteral(node)) {
        return numberLiteralSchema(node, refDb, [Number(node.text)]);
    }

    if (isUnionTypeNode(node)) {
        return handleUnionTypeNode(node, args);
    }

    if (isEnumDeclaration(node)) {
        return handleEnumDeclaration(node, args);
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
