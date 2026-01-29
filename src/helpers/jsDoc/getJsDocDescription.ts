import { isJSDocLink, type Node } from "typescript";
import { readJsDocLink } from "./readJsDocLink";

/** Trimmed value of the JSDoc comment on the given {@link node}. */
export function getJsDocDescription(node: Node): string | null {
    const comment = node.jsDoc?.at(0)?.comment;

    if (comment === undefined) {
        return null;
    }

    if (typeof comment === "string") {
        return comment.trim();
    }

    /**
     * A string {@link https://www.example.com example.com} alias.
     */
    const output: string[] = [];

    for (const commentNode of comment) {
        if (isJSDocLink(commentNode)) {
            output.push(readJsDocLink(commentNode));
        } else {
            output.push(commentNode.text);
        }
    }

    return output.join("");
}
