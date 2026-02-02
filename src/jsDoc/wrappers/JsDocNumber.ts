import type { Node } from "typescript";
import { ParserError } from "@/errors/ParserError";
import { JsDocOutput } from "./JsDocOutput";

export class JsDocNumber extends JsDocOutput<number> {
    public constructor(node: Node, tagName: string, value: number) {
        super(node, tagName, value);
    }

    public min(x: number): this {
        if (this.value < x) {
            throw new ParserError(
                this.node,
                `Value for JSDoc tag "${this.tagName}" cannot be less than ${x} (got ${this.value})`,
            );
        }

        return this;
    }
}
