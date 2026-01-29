import type { Node } from "typescript";
import { ParserError } from "@/errors/ParserError";

export class RawJsDocWrapper {
    protected readonly node: Node;

    protected readonly tagName: string;

    private readonly rawValue: string | null;

    public constructor(node: Node, tagName: string, rawValue: string | null) {
        this.node = node;
        this.tagName = tagName;
        this.rawValue = rawValue;
    }

    public string(): ResolvedJsDocWrapper<string> {
        if (this.rawValue === null) {
            return new ResolvedJsDocWrapper<string>(this.node, this.tagName, null);
        }

        if (
            this.rawValue.length > 1 &&
            this.rawValue.at(0) === '"' &&
            this.rawValue.at(-1) === '"'
        ) {
            // starts and ends with quotation marks, trim them off
            return new ResolvedJsDocWrapper(this.node, this.tagName, this.rawValue.slice(1, -1));
        }

        return new ResolvedJsDocWrapper(this.node, this.tagName, this.rawValue);
    }

    public integer(): NumberJsDocWrapper {
        if (this.rawValue === null) {
            return new NumberJsDocWrapper(this.node, this.tagName, null);
        }

        const newValue = Number(this.rawValue);

        if (!Number.isInteger(newValue)) {
            throw new ParserError(
                this.node,
                `Value for JSDoc tag "${this.tagName}" must be an integer (got ${this.rawValue})`,
            );
        }

        return new NumberJsDocWrapper(this.node, this.tagName, newValue);
    }

    public number(): NumberJsDocWrapper {
        if (this.rawValue === null) {
            return new NumberJsDocWrapper(this.node, this.tagName, null);
        }

        const newValue = Number(this.rawValue);

        if (Number.isNaN(newValue)) {
            throw new ParserError(
                this.node,
                `Value for JSDoc tag "${this.tagName}" must be a number (got ${this.rawValue})`,
            );
        }

        return new NumberJsDocWrapper(this.node, this.tagName, newValue);
    }
}

export class ResolvedJsDocWrapper<T> extends RawJsDocWrapper {
    public readonly value: T | null;

    public constructor(node: Node, tagName: string, value: T | null) {
        super(node, tagName, null);
        this.value = value;
    }
}

export class NumberJsDocWrapper extends ResolvedJsDocWrapper<number> {
    public min(x: number): this {
        if (this.value !== null && this.value < x) {
            throw new ParserError(
                this.node,
                `Value for JSDoc tag "${this.tagName}" cannot be less than ${x} (got ${this.value})`,
            );
        }

        return this;
    }
}
