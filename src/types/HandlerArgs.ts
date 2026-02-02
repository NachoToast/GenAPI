import type { TypeChecker } from "typescript";
import type { ReferenceDatabase } from "@/classes/ReferenceDatabase";

export interface HandlerArgs {
    refDb: ReferenceDatabase;

    typeChecker: TypeChecker;
}
