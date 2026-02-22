import type { UnionTypeNode } from "typescript";
import { AnyKeywordSchema } from "@/schemas/any/classes/AnyKeywordSchema";
import type { AnySchemaObject } from "@/schemas/base/SchemaObject";
import { NullKeywordSchema } from "@/schemas/null/classes/NullKeywordSchema";
import { SimpleNullUnionSchema } from "@/schemas/union/SimpleNullUnionSchema";
import { UnionTypeNodeSchema } from "@/schemas/union/UnionTypeNodeSchema";
import { UnknownKeywordSchema } from "@/schemas/unknown/classes/UnknownKeywordSchema";
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
    a: AnySchemaObject,
    b: AnySchemaObject,
): AnySchemaObject | null {
    const aIsNull = a instanceof NullKeywordSchema;
    const bIsNull = b instanceof NullKeywordSchema;

    if (aIsNull === bIsNull) {
        // both are null or neither are null
        return null;
    }

    if (aIsNull) {
        return new SimpleNullUnionSchema(node, b);
    }

    return new SimpleNullUnionSchema(node, a);
}

export function handleUnionTypeNode(
    node: UnionTypeNode,
    args: HandlerArgs,
): AnySchemaObject | null {
    const finalisedNodes = node.types.map((x) => handleNode(x, args)).filter((x) => x !== null);

    if (finalisedNodes.length === 0) {
        return null;
    }

    if (finalisedNodes.length === 1) {
        return finalisedNodes[0];
    }

    const anySchema = finalisedNodes.find((x) => x instanceof AnyKeywordSchema);

    if (anySchema !== undefined) {
        // simplify unions with any
        return anySchema;
    }

    const unknownSchema = finalisedNodes.find((x) => x instanceof UnknownKeywordSchema);

    if (unknownSchema !== undefined) {
        // simplify unions with unknown
        return unknownSchema;
    }

    if (finalisedNodes.length === 2) {
        // simplify single unions with null
        const asNullUnion = handleNullUnion(node, finalisedNodes[0], finalisedNodes[1]);

        if (asNullUnion !== null) {
            return asNullUnion;
        }
    }

    return new UnionTypeNodeSchema(node, finalisedNodes);
}
