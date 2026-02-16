import type { Node } from "typescript";
import type { ReferenceDatabase } from "@/types/ReferenceDatabase";
import { SchemaObject } from "./base/SchemaObject";
import { compDescription } from "./components/compDescription";
import { compEnum } from "./components/compEnum";
import { compExampleString } from "./components/compExample";
import { compMaxLength } from "./components/compMaxLength";
import { compMinLength } from "./components/compMinLength";
import { compTypeString } from "./components/compTypeString";

/**
 * Schema for a string keyword.
 *
 * JSDoc:
 * - \@example [string]
 * - \@minLength [integer>=1]
 * - \@maxLength [integer>=0]
 */
export function stringKeywordSchema(node: Node, refDb: ReferenceDatabase): SchemaObject<string> {
    return new SchemaObject(
        node,
        refDb,
        compTypeString,
        compDescription,
        compExampleString,
        compMinLength,
        compMaxLength,
    );
}

/** Schema for a string literal. */
export function stringLiteralSchema(
    node: Node,
    refDb: ReferenceDatabase,
    values: string[],
): SchemaObject<string> {
    return new SchemaObject(
        node,
        refDb,
        compTypeString,
        compDescription,
        compEnum(values, (x) => `"${x}"`),
    );
}
