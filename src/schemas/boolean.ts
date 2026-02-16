import type { Node } from "typescript";
import type { ReferenceDatabase } from "@/types/ReferenceDatabase";
import { SchemaObject } from "./base/SchemaObject";
import { compDescription } from "./components/compDescription";
import { compEnum } from "./components/compEnum";
import { compExampleBoolean } from "./components/compExample";
import { compTypeBoolean } from "./components/compTypeBoolean";

/**
 * Schema for a boolean keyword.
 *
 * JSDoc:
 * - \@example [boolean]
 */
export function booleanKeywordSchema(node: Node, refDb: ReferenceDatabase): SchemaObject<boolean> {
    return new SchemaObject(node, refDb, compTypeBoolean, compDescription, compExampleBoolean);
}

/** Schema for a boolean literal. */
export function booleanLiteralSchema(
    node: Node,
    refDb: ReferenceDatabase,
    values: boolean[],
): SchemaObject<boolean> {
    return new SchemaObject(
        node,
        refDb,
        compTypeBoolean,
        compDescription,
        compEnum(values, (x) => x.toString()),
    );
}
