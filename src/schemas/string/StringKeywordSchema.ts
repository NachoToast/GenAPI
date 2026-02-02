import type { Node } from "typescript";
import type { ReferenceDatabase } from "@/classes/ReferenceDatabase";
import { StringValidator } from "@/validators/StringValidator";
import type { Validator } from "@/validators/Validator";
import { SchemaObject } from "../SchemaObject";

/**
 * ```ts
 * string
 * ```
 */
export class StringKeywordSchema extends SchemaObject<string> {
    public constructor(node: Node, refDb: ReferenceDatabase) {
        super({ node, type: "string", hasDescription: false, exampleFn: null }, refDb);
    }

    public override makeValidator(): Validator {
        return new StringValidator();
    }
}
