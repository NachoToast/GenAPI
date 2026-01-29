import type { Node, TypeChecker } from "typescript";
import type { ReferenceDatabase } from "@/classes/ReferenceDatabase";
import type { SchemaObject } from "@/schemas/SchemaObject";

export interface HandlerArgs {
    refDb: ReferenceDatabase;

    typeChecker: TypeChecker;

    handleNode: (node: Node, args: HandlerArgs) => SchemaObject | null;
}
