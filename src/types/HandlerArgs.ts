import type { TypeChecker } from "typescript";
import type { SchemaDatabase } from "./ReferenceDatabase";

export interface HandlerArgs {
    schemaDb: SchemaDatabase;

    typeChecker: TypeChecker;
}
