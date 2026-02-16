import type { UnionTypeNode } from "typescript";
import { SchemaFlag } from "@/schemas/base/SchemaFlag";
import { SchemaObject } from "@/schemas/base/SchemaObject";
import { UnionTypeNodeSchema } from "@/schemas/classes/UnionTypeNodeSchema";
import { compDescription } from "@/schemas/components/compDescription";
import { compNullable } from "@/schemas/components/compNullable";
import type { HandlerArgs } from "@/types/HandlerArgs";
import type { ReferenceDatabase } from "@/types/ReferenceDatabase";
import { handleNode } from "./handleNode";

/**
 * Unions that are only a type and null can be better represent in the schema by the `nullable`
 * field instead of the `oneOf` field.
 *
 * This functions checks when such cases are possible.
 */
function handleNullUnion(
    a: SchemaObject,
    b: SchemaObject,
    refDb: ReferenceDatabase,
): SchemaObject | null {
    const aIsNull = a.hasFlag(SchemaFlag.CanDoSimpleNullableUnions);
    const bIsNull = b.hasFlag(SchemaFlag.CanDoSimpleNullableUnions);

    if (aIsNull === bIsNull) {
        // both are null or neither are null
        return null;
    }

    if (aIsNull) {
        return new SchemaObject(b.node, refDb, ...b.components, compNullable);
    }

    return new SchemaObject(a.node, refDb, ...a.components, compNullable);
}

function filterUnionMembers(x: SchemaObject | null): x is SchemaObject {
    if (x === null) {
        return false;
    }

    if (x.hasFlag(SchemaFlag.RemovedInUnions)) {
        return false;
    }

    return true;
}

export function handleUnionTypeNode(node: UnionTypeNode, args: HandlerArgs): SchemaObject {
    const root = new UnionTypeNodeSchema(node, args.refDb, compDescription);

    const finalisedNodes = node.types.map((x) => handleNode(x, args)).filter(filterUnionMembers);

    if (finalisedNodes.length === 0) {
        return root;
    }

    if (finalisedNodes.length === 1) {
        return finalisedNodes[0];
    }

    const indexOfAny = finalisedNodes.findIndex((x) => x.hasFlag(SchemaFlag.TakesOverUnions));

    if (indexOfAny !== -1) {
        // simplify unions with any/unknown
        return finalisedNodes[indexOfAny];
    }

    if (finalisedNodes.length === 2) {
        // simplify single unions with null
        const asNullUnion = handleNullUnion(finalisedNodes[0], finalisedNodes[1], args.refDb);

        if (asNullUnion !== null) {
            return asNullUnion;
        }
    }

    root.addSchemas(finalisedNodes);

    return root;
}
