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
import { ParserError } from "@/errors/ParserError";
import { ValidationError } from "@/errors/ValidationError";
import { getReferencedType } from "@/helpers/getReferencedType";
import { NumberKeywordSchema } from "@/schemas/number/NumberKeywordSchema";
import { NumberLiteralSchema } from "@/schemas/number/NumberLiteralSchema";
import type { SchemaObject } from "@/schemas/SchemaObject";
import { StringKeywordSchema } from "@/schemas/string/StringKeywordSchema";
import { StringLiteralSchema } from "@/schemas/string/StringLiteralSchema";
import type { HandlerArgs } from "@/types/HandlerArgs";
import { handleInterfaceDeclaration } from "./handleInterfaceDeclaration";
import { handlePropertySignature } from "./handlePropertySignature";
import { handleTypeAliasDeclaration } from "./handleTypeAliasDeclaration";

function handleNodeInternal(node: Node, args: HandlerArgs): SchemaObject | null {
    const asRef = args.refDb.tryReference(node);

    if (asRef !== null) {
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
        return handleNodeInternal(getReferencedType(node, args.typeChecker), args);
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
        return handleNodeInternal(node.literal, args);
    }

    if (isStringLiteral(node)) {
        return new StringLiteralSchema(node, args.refDb, node.text);
    }

    if (isNumericLiteral(node)) {
        return new NumberLiteralSchema(node, args.refDb, Number(node.text));
    }

    throw new ParserError(node, `Unsure how to handle node of kind ${SyntaxKind[node.kind]}`);
}

/**
 * Converts a {@link node} to a {@link SchemaObject}.
 *
 * Note that **all** instantiated schema objects **must** originate from this function so that
 * necessary post-instantiation logic can occur.
 */
export function handleNode(node: Node, args: HandlerArgs): SchemaObject | null {
    const schemaObject = handleNodeInternal(node, args);

    if (schemaObject !== null && schemaObject.example !== null) {
        // Post-Instantiation Logic
        try {
            schemaObject.makeValidator().validate(schemaObject.example);
        } catch (error) {
            if (!(error instanceof ValidationError)) {
                throw error;
            }

            throw new ParserError(
                schemaObject.node,
                `JSDoc example tag does not conform to the schema: ${error.message}`,
            );
        }
    }

    return schemaObject;
}
