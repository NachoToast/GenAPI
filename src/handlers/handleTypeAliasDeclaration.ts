import type { TypeAliasDeclaration } from "typescript";
import type { SchemaObject } from "@/schemas/base/SchemaObject";
import type { HandlerArgs } from "@/types/HandlerArgs";
import { handleNode } from "./handleNode";

export function handleTypeAliasDeclaration(
    node: TypeAliasDeclaration,
    args: HandlerArgs,
): SchemaObject | null {
    const pointsTo = handleNode(node.type, args);

    if (pointsTo === null) {
        return null;
    }

    return pointsTo.toIdentified({ node, refDb: args.refDb, identifier: node.name });
}
