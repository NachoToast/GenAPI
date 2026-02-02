import { describe, expect, test } from "bun:test";
import { isTypeAliasDeclaration } from "typescript";
import { createDefaultTestNode } from "@/tests/createDefaultTestNode";
import { createTestNode } from "@/tests/createTestNode";
import { getJsDocExample } from "./getJsDocExample";

describe(getJsDocExample.name, () => {
    test("returns null when no JSDoc is present", () => {
        const node = createDefaultTestNode();

        expect(getJsDocExample(node, String)).toBeNull();
    });

    test("returns null when no @example tag is present", () => {
        const code = `
        /**
         * A description.
         *
         * @see {@link SomeLink}
         * @deprecated Another tag
        */
        type MyTestNode = string;
        `;

        const node = createTestNode(code, isTypeAliasDeclaration);

        expect(getJsDocExample(node, String)).toBeNull();
    });

    test("returns the @example tag value when it's the only JSDoc node", () => {
        const code = `
        /** @example abcdefg */
        type MyTestNode = string;
        `;

        const node = createTestNode(code, isTypeAliasDeclaration);

        expect(getJsDocExample(node, String)).toBe("abcdefg");
    });

    test("returns the @example tag value when other JSDoc tags are present", () => {
        const code = `
        /**
         * A description.
         *
         * @see {@link SomeLink}
         * @example abc123
         * @deprecated Another tag
        */
        type MyTestNode = string;
        `;

        const node = createTestNode(code, isTypeAliasDeclaration);

        expect(getJsDocExample(node, String)).toBe("abc123");
    });
});
