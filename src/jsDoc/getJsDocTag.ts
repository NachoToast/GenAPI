import type { Node } from "typescript";
import { enumerateJsDocTags } from "./enumerateJsDocTags";
import { JsDocInput } from "./wrappers/JsDocInput";
import type { JsDocOutput } from "./wrappers/JsDocOutput";

/**
 * Gets and validates the value of the JSDoc tag with the given {@link tagName} on the given
 * {@link node}, if it exists.
 */
export function getJsDocTag<T>(
    node: Node,
    tagName: string,
    validationFn: (x: JsDocInput) => JsDocOutput<T>,
): T | null {
    for (const tag of enumerateJsDocTags(node)) {
        if (tag.tagName.escapedText === tagName) {
            const rawValue = tag.comment?.toString().trim() ?? "";

            return validationFn(new JsDocInput(node, tagName, rawValue)).value;
        }
    }

    return null;
}
