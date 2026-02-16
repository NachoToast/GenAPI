import type { Node } from "typescript";
import { JsDocOutput } from "./JsDocOutput";

export class JsDocString extends JsDocOutput<string> {
    public constructor(node: Node, tagName: string, value: string) {
        super(node, tagName, value);
    }
}
