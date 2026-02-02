import { describe, expect, test } from "bun:test";
import { createDefaultTestNode } from "@/tests/createDefaultTestNode";
import { ParserError } from "./ParserError";

describe(ParserError.name, () => {
    describe(ParserError.prototype.makeChild.name, () => {
        const node = createDefaultTestNode();

        const message = "some error message";

        const error = new ParserError(node, message).makeChild();

        test("creates an error object without a node property", () => {
            expect(error).not.toMatchObject({ node });
        });

        test("preserves the original message", () => {
            expect(error.message).toInclude(message);
        });
    });
});
