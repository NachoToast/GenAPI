import type { Node } from "typescript";

export abstract class JsDocOutput<T> {
    public readonly value: T;

    protected readonly node: Node;

    protected readonly tagName: string;

    protected constructor(node: Node, tagName: string, value: T) {
        this.node = node;
        this.tagName = tagName;
        this.value = value;
    }
}
