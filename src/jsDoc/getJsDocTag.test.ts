import { describe, expect, test } from "bun:test";
import { isTypeAliasDeclaration } from "typescript";
import { createDefaultTestNode } from "@/tests/createDefaultTestNode";
import { createTestNode } from "@/tests/createTestNode";
import { getJsDocTag } from "./getJsDocTag";

describe(getJsDocTag, () => {
    test("returns null when no JSDoc is present", () => {
        const node = createDefaultTestNode();

        expect(getJsDocTag(node, "test", (x) => x.string())).toBeNull();
    });

    test("returns the correct value when a single JSDoc tag is present", () => {
        const code = `
        /** @test some tag */
        type MyTestNode = string;
        `;

        const node = createTestNode(code, isTypeAliasDeclaration);

        expect(getJsDocTag(node, "test", (x) => x.string())).toBe("some tag");
        expect(getJsDocTag(node, "test2", (x) => x.string())).toBeNull();
    });

    test("returns the correct value when multiple JSDoc tags are present", () => {
        const code = `
        /**
         * Some description, {@link SomeLink}
         *
         * @doe a deer, a female deer
         * @ray a drop of golden sun
         * @me a name I call myself
         */
        type MyTestNode = string;
        `;

        const node = createTestNode(code, isTypeAliasDeclaration);

        expect(getJsDocTag(node, "ray", (x) => x.string())).toBe("a drop of golden sun");
        expect(getJsDocTag(node, "far", (x) => x.string())).toBeNull();
    });
});
