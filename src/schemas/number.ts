import type { Node } from "typescript";
import { getJsDocTag } from "@/jsDoc/getJsDocTag";
import type { ReferenceDatabase } from "@/types/ReferenceDatabase";
import type { SchemaComponent } from "./base/SchemaComponent";
import { SchemaObject } from "./base/SchemaObject";
import { compDescription } from "./components/compDescription";
import { compEnum } from "./components/compEnum";
import { compExampleNumber } from "./components/compExample";
import { compMaximum } from "./components/compMaximum";
import { compMinimum } from "./components/compMinimum";
import { compTypeInteger } from "./components/compTypeInteger";
import { compTypeNumber } from "./components/compTypeNumber";

/**
 * Schema for a number keyword.
 *
 * JSDoc:
 * - \@example [number]
 * - \@integer [true]
 * - \@min [number]
 * - \@max [number]
 */
export function numberKeywordSchema(node: Node, refDb: ReferenceDatabase): SchemaObject<number> {
    let typeComp: SchemaComponent<number>;

    if (getJsDocTag(node, "integer", (x) => x.string()) !== null) {
        typeComp = compTypeInteger;
    } else {
        typeComp = compTypeNumber;
    }

    return new SchemaObject(
        node,
        refDb,
        typeComp,
        compDescription,
        compExampleNumber,
        compMinimum,
        compMaximum,
    );
}

/** Schema for a number literal. */
export function numberLiteralSchema(
    node: Node,
    refDb: ReferenceDatabase,
    values: number[],
): SchemaObject<number> {
    let typeComp: SchemaComponent<number>;

    if (values.every((x) => Number.isSafeInteger(x))) {
        typeComp = compTypeInteger;
    } else {
        typeComp = compTypeNumber;
    }

    return new SchemaObject(
        node,
        refDb,
        typeComp,
        compDescription,
        compEnum(values, (x) => x.toString()),
    );
}
