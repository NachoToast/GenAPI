import type { Node } from "typescript";
import { ParserError } from "@/errors/ParserError";
import { type CompExample, compExample } from "@/schemas/base/components/compExample";

function parseBool(input: string): boolean {
    switch (input.toLowerCase()) {
        case "true":
            return true;
        case "false":
            return false;
    }

    throw new Error(`Expected "true" or "false", but got "${input}"`);
}

export function compBooleanExample(node: Node): CompExample<boolean> | null {
    try {
        return compExample(node, parseBool);
    } catch (error) {
        if (!(error instanceof Error)) {
            throw error;
        }

        throw new ParserError(node, error.message);
    }
}
