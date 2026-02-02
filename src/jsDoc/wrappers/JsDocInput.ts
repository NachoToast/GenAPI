import type { Node } from "typescript";
import { ParserError } from "@/errors/ParserError";
import { JsDocNumber } from "./JsDocNumber";
import { JsDocOutput } from "./JsDocOutput";

export class JsDocInput {
    private readonly node: Node;

    private readonly tagName: string;

    private readonly value: string;

    public constructor(node: Node, tagName: string, value: string) {
        this.node = node;
        this.tagName = tagName;
        this.value = value;
    }

    public string(): JsDocOutput<string> {
        if (this.value.length > 1 && this.value.at(0) === '"' && this.value.at(-1) === '"') {
            // starts and ends with quotation marks, trim them off
            return new JsDocOutput(this.node, this.tagName, this.value.slice(1, -1));
        }

        return new JsDocOutput(this.node, this.tagName, this.value);
    }

    public number(): JsDocNumber {
        const value = Number(this.value);

        if (this.value.trim() === "") {
            throw new ParserError(
                this.node,
                `Value for JSDoc tag "${this.tagName}" must be a number`,
            );
        }

        if (Number.isNaN(value)) {
            throw new ParserError(
                this.node,
                `Value for JSDoc tag "${this.tagName}" must be a number (got ${this.value})`,
            );
        }

        return new JsDocNumber(this.node, this.tagName, value);
    }

    public integer(): JsDocNumber {
        const value = Number(this.value);

        if (this.value.trim() === "" || !Number.isInteger(value)) {
            throw new ParserError(
                this.node,
                `Value for JSDoc tag "${this.tagName}" must be an integer (got ${this.value})`,
            );
        }

        return new JsDocNumber(this.node, this.tagName, value);
    }
}
