import { describe, expect, test } from "bun:test";
import { isTypeAliasDeclaration } from "typescript";
import { createDefaultTestNode } from "@/tests/createDefaultTestNode";
import { createTestNode } from "@/tests/createTestNode";
import { getJsDocDescription } from "./getJsDocDescription";

describe(getJsDocDescription.name, () => {
    test("returns null when no JSDoc is present", () => {
        const node = createDefaultTestNode();

        expect(getJsDocDescription(node)).toBeNull();
    });

    test("returns basic text descriptions", () => {
        const code = `
        /** Basic one line description. */
        type MyTestNode = string;
        `;

        const node = createTestNode(code, isTypeAliasDeclaration);

        expect(getJsDocDescription(node)).toBe("Basic one line description.");
    });

    test("returns multiline text descriptions", () => {
        const code = `
        /**
         * one line
         * two line
         * red line
         * blue line
         */
        type MyTestNode = string;
        `;

        const node = createTestNode(code, isTypeAliasDeclaration);

        expect(getJsDocDescription(node)).toBe("one line\ntwo line\nred line\nblue line");
    });

    test("ignores unrelated JSDoc tags", () => {
        const code = `
        /**
         * cool description
         *
         * @see {@link SomeLink}
         *
         * other text, not part of description
         */
        type MyTestNode = string;
        `;

        const node = createTestNode(code, isTypeAliasDeclaration);

        expect(getJsDocDescription(node)).toBe("cool description");
    });

    test("returns full descriptions with inline JSDoc tags", () => {
        const code = `
        /**
         * Some description, {@link SomeLink}, more text.
         */
        type MyTestNode = string;
        `;

        const node = createTestNode(code, isTypeAliasDeclaration);

        expect(getJsDocDescription(node)).toBe("Some description, **SomeLink**, more text.");
    });
});
