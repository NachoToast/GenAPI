import type { Node } from "typescript";
import { getJsDocTagValueByName } from "./getJsDocTagValueByName";
import { RawJsDocWrapper, type ResolvedJsDocWrapper } from "./JsDocWrappers";

/**
 * Gets a JsDoc tag value on a node.
 *
 * This includes tags without first class TypeScript support (such as **\@example**).
 *
 * @see {@link https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html JSDoc Reference}
 */
export function getJsDocTag<T>(
    node: Node,
    name: string,
    validationFn: (x: RawJsDocWrapper) => ResolvedJsDocWrapper<T>,
): T | null {
    const rawValue = getJsDocTagValueByName(node, name);

    return validationFn(new RawJsDocWrapper(node, name, rawValue)).value;
}
