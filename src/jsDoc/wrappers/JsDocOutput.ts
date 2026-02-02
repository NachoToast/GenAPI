import type { Node } from "typescript";

export class JsDocOutput<T> {
    public readonly value: T;

    protected readonly node: Node;

    protected readonly tagName: string;

    public constructor(node: Node, tagName: string, value: T) {
        this.node = node;
        this.tagName = tagName;
        this.value = value;
    }
}
