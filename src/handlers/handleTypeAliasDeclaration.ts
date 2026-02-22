import type { TypeAliasDeclaration } from "typescript";
import type { AnySchemaObject } from "@/schemas/base/SchemaObject";
import type { HandlerArgs } from "@/types/HandlerArgs";
import { handleNode } from "./handleNode";

export function handleTypeAliasDeclaration(
    node: TypeAliasDeclaration,
    args: HandlerArgs,
): AnySchemaObject | null {
    const schema = handleNode(node.type, args);

    if (schema == null) {
        return null;
    }

    return schema.toNamed({ node, baseName: node.name.text, schemaDb: args.schemaDb });
}
