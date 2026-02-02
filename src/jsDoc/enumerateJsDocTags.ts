import type { JSDocTag, Node } from "typescript";

/** Enumerates through all the JSDoc tags of the given {@link node}. */
export function* enumerateJsDocTags(node: Node): Generator<JSDocTag> {
    if (node.jsDoc === undefined) return;

    for (const jsDoc of node.jsDoc) {
        if (jsDoc.tags === undefined) continue;

        yield* jsDoc.tags;
    }
}
