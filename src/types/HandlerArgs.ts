import type { TypeChecker } from "typescript";
import type { ReferenceDatabase } from "./ReferenceDatabase";

export interface HandlerArgs {
    refDb: ReferenceDatabase;

    typeChecker: TypeChecker;
}
