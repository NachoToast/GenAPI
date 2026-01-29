import { describe, expect, test } from "bun:test";
import { isTypeAliasDeclaration } from "typescript";
import { testNode } from "@/tests/parsingHelpers";
import { enumerateJsDocTags } from "./enumerateJsDocTags";

describe(enumerateJsDocTags.name, () => {
    test("handles no JSDoc", () => {
        const node = testNode("type MyTestNode = string", isTypeAliasDeclaration);

        const jsDoc = enumerateJsDocTags(node).toArray();

        expect(jsDoc).toHaveLength(0);
    });

    test("handles tags", () => {
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

        const node = testNode(code, isTypeAliasDeclaration);

        const jsDoc = enumerateJsDocTags(node).toArray();

        expect(jsDoc).toHaveLength(3);

        expect(jsDoc[0].getText()).toInclude("@a");
        expect(jsDoc[1].getText()).toInclude("@b");
        expect(jsDoc[2].getText()).toInclude("@c");
    });
});
