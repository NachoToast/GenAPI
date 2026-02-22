import type { Node } from "typescript";
import { UnsupportedNodeError } from "@/errors/UnsupportedNodeError";
import { handleNode } from "@/handlers/handleNode";
import type { AnySchemaObject } from "@/schemas/base/SchemaObject";
import type { HandlerArgs } from "@/types/HandlerArgs";

export function handleNodeSilence(node: Node, args: HandlerArgs): AnySchemaObject | null {
    try {
        return handleNode(node, args);
    } catch (error) {
        if (error instanceof UnsupportedNodeError) {
            return null;
        }

        throw error;
    }
}

export function handleNodeLog(node: Node, args: HandlerArgs): AnySchemaObject | null {
    try {
        return handleNode(node, args);
    } catch (error) {
        if (error instanceof UnsupportedNodeError) {
            console.log(error.message);
            return null;
        }

        throw error;
    }
}
