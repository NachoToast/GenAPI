import type { Node } from "typescript";
import { type CompExample, compExample } from "@/schemas/base/components/compExample";

export function compStringExample(node: Node): CompExample<string> | null {
    return compExample(node, String);
}
