import type { TypeAliasDeclaration } from "typescript";
import { IdentifiedSchemaObject } from "@/schemas/base/IdentifiedSchemaObject";
import type { HandlerArgs } from "@/types/HandlerArgs";
import { handleNode } from "./handleNode";

export function handleTypeAliasDeclaration(
    node: TypeAliasDeclaration,
    args: HandlerArgs,
): IdentifiedSchemaObject | null {
    const pointsTo = handleNode(node.type, args);

    if (pointsTo === null) {
        return null;
    }

    return new IdentifiedSchemaObject(node, args.refDb, node.name, ...pointsTo.components);
}
