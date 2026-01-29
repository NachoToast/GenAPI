import type { Node } from "typescript";
import type { ReferenceDatabase } from "@/classes/ReferenceDatabase";
import { NumberValidator } from "@/validators/Number";
import type { Validator } from "@/validators/Validator";
import { SchemaObject } from "../SchemaObject";

/**
 * ```ts
 * number
 * ```
 */
export class NumberKeywordSchema extends SchemaObject<number> {
    public constructor(node: Node, refDb: ReferenceDatabase) {
        super({ node, type: "number", hasDescription: false, exampleFn: null }, refDb);
    }

    public override makeValidator(): Validator {
        return new NumberValidator(false);
    }
}
