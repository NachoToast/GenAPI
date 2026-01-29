import type { Node } from "typescript";
import { getJsDocTag } from "./getJsDocTag";

/** Value of the **\@example** JSDoc node. */
export function getJsDocExample<T>(node: Node, transformFn: (rawValue: string) => T): T | null {
    const rawValue = getJsDocTag(node, "example", x => x.string());

    if (rawValue === null) {
        return null;
    }

    return transformFn(rawValue);
}
