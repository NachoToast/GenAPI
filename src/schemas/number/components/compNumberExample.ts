import type { Node } from "typescript";
import { type CompExample, compExample } from "@/schemas/base/components/compExample";

export function compNumberExample(node: Node): CompExample<number> | null {
    return compExample(node, Number);
}
