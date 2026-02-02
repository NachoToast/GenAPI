import { describe, expect, test } from "bun:test";
import { isTypeAliasDeclaration } from "typescript";
import { createDefaultTestNode } from "@/tests/createDefaultTestNode";
import { createTestNode } from "@/tests/createTestNode";
import { enumerateJsDocTags } from "./enumerateJsDocTags";

describe(enumerateJsDocTags.name, () => {
    test("returns an empty enumerable when no JSDoc is present", () => {
        const node = createDefaultTestNode();

        const jsDoc = enumerateJsDocTags(node).toArray();

        expect(jsDoc).toHaveLength(0);
    });

    test("returns an empty enumerable when no JSDoc tags are present", () => {
        const code = `
        /**
         * some description {@link SomeLink}
         */
        type MyTestNode = string;
        `;

        const node = createTestNode(code, isTypeAliasDeclaration);

        const jsDoc = enumerateJsDocTags(node).toArray();

        expect(jsDoc).toHaveLength(0);
    });

    test("returns all present JSDoc tags", () => {
        const code = `
        /**
         * some description
         *
         * @a
         * @b
         * @c
         */
        type MyTestNode = string;
        `;

        const node = createTestNode(code, isTypeAliasDeclaration);

        const jsDoc = enumerateJsDocTags(node).toArray();

        expect(jsDoc).toHaveLength(3);

        expect(jsDoc[0].getText()).toInclude("@a");
        expect(jsDoc[1].getText()).toInclude("@b");
        expect(jsDoc[2].getText()).toInclude("@c");
    });
});
