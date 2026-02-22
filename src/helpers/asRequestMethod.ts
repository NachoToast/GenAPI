import type { Node } from "typescript";
import { ParserError } from "@/errors/ParserError";
import type { RequestMethod } from "@/types/RequestMethod";

const validMethods: ReadonlySet<string> = new Set<RequestMethod>([
    "get",
    "put",
    "post",
    "delete",
    "options",
    "head",
    "patch",
    "trace",
]);

function isRequestMethod(x: string): x is RequestMethod {
    return validMethods.has(x);
}

/** Ensures that the given string {@link x} is a spec-conformant HTTP {@link RequestMethod}. */
export function asRequestMethod(node: Node, x: string): RequestMethod {
    if (!isRequestMethod(x)) {
        throw new ParserError(node, `"${x}" is not a valid HTTP request method`);
    }

    return x;
}
