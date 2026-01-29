import type { Node } from "typescript";
import { enumerateJsDocTags } from "./enumerateJsDocTags";

export function getJsDocTagValueByName(node: Node, name: string): string | null {
    for (const tag of enumerateJsDocTags(node)) {
        if (tag.tagName.escapedText === name) {
            return tag.comment?.toString().trim() ?? "";
        }
    }

    return null;
}
