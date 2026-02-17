import type { UnionTypeNode } from "typescript";
import {
    AnyKeywordSchema,
    IdentifiedAnyKeywordSchema,
} from "@/schemas/any/classes/AnyKeywordSchema";
import type { SchemaObject } from "@/schemas/base/SchemaObject";
import {
    IdentifiedNullKeywordSchema,
    NullKeywordSchema,
} from "@/schemas/null/classes/NullKeywordSchema";
import { SimpleNullUnionSchema } from "@/schemas/union/classes/SimpleNullUnionSchema";
import { UnionTypeNodeSchema } from "@/schemas/union/classes/UnionTypeNodeSchema";
import {
    IdentifiedUnknownKeywordSchema,
    UnknownKeywordSchema,
} from "@/schemas/unknown/classes/UnknownKeywordSchema";
import type { HandlerArgs } from "@/types/HandlerArgs";
import { handleNode } from "./handleNode";

/**
 * Unions that are only a type and null can be better represent in the schema by the `nullable`
 * field instead of the `oneOf` field.
 *
 * This functions checks when such cases are possible.
 */
function handleNullUnion(
    node: UnionTypeNode,
    a: SchemaObject,
    b: SchemaObject,
): SchemaObject | null {
    const aIsNull = a instanceof NullKeywordSchema || a instanceof IdentifiedNullKeywordSchema;
    const bIsNull = b instanceof NullKeywordSchema || b instanceof IdentifiedNullKeywordSchema;

    if (aIsNull === bIsNull) {
        // both are null or neither are null
        return null;
    }

    if (aIsNull) {
        return new SimpleNullUnionSchema(node, b);
    }

    return new SimpleNullUnionSchema(node, a);
}

export function handleUnionTypeNode(node: UnionTypeNode, args: HandlerArgs): SchemaObject {
    const root = new UnionTypeNodeSchema(node);

    const finalisedNodes = node.types.map((x) => handleNode(x, args)).filter((x) => x !== null);

    if (finalisedNodes.length === 0) {
        return root;
    }

    if (finalisedNodes.length === 1) {
        return finalisedNodes[0];
    }

    const indexOfAny = finalisedNodes.findIndex(
        (x) => x instanceof AnyKeywordSchema || x instanceof IdentifiedAnyKeywordSchema,
    );

    if (indexOfAny !== -1) {
        // simplify unions with any
        return finalisedNodes[indexOfAny];
    }

    const indexOfUnknown = finalisedNodes.findIndex(
        (x) => x instanceof UnknownKeywordSchema || x instanceof IdentifiedUnknownKeywordSchema,
    );

    if (indexOfUnknown !== -1) {
        // simplify unions with unknown
        return finalisedNodes[indexOfUnknown];
    }

    if (finalisedNodes.length === 2) {
        // simplify single unions with null
        const asNullUnion = handleNullUnion(node, finalisedNodes[0], finalisedNodes[1]);

        if (asNullUnion !== null) {
            return asNullUnion;
        }
    }

    root.addSchemas(finalisedNodes);

    return root;
}
