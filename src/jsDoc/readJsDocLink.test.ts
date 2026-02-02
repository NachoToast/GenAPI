import { describe, expect, test } from "bun:test";
import { isJSDocLink, isTypeAliasDeclaration, type JSDocLink } from "typescript";
import { ParserError } from "@/errors/ParserError";
import { createTestNode } from "@/tests/createTestNode";
import { readJsDocLink } from "./readJsDocLink";

function createTestLinkNode(code: string): JSDocLink {
    const node = createTestNode(code, isTypeAliasDeclaration);

    const commentNodes = node.jsDoc?.at(0)?.comment;

    if (!Array.isArray(commentNodes)) {
        throw new Error("Expected comment array");
    }

    const linkNode = commentNodes.at(-1);

    if (typeof linkNode !== "object" || !isJSDocLink(linkNode)) {
        throw new Error("Expected JSDocLink node object");
    }

    return linkNode;
}

describe(readJsDocLink.name, () => {
    test("throws a ParserError if the JSDoc @link tag is invalid", () => {
        const code = `
        /**
         * {@link}
         */
        type MyTestNode = string;
        `;

        const node = createTestLinkNode(code);

        expect(() => readJsDocLink(node)).toThrowError(ParserError);
    });

    test("throws a ParserError if the JSDoc @link tag has an invalid identifier", () => {
        const code = `
        /**
         * {@link}
         */
        type MyTestNode = string;
        `;

        const node = createTestLinkNode(code);

        // I have no idea what kind of comments causes anything that's not an identifier or
        // undefined to be generated.
        // @ts-expect-error
        node.name = {};

        expect(() => readJsDocLink(node)).toThrowError(ParserError);
    });

    test("returns the text of non-masked non-URL links", () => {
        const code = `
        /**
         * {@link SomeNode}
         */
        type MyTestNode = string;
        `;

        const output = readJsDocLink(createTestLinkNode(code));

        expect(output).toBe("**SomeNode**");
    });

    test('returns the "true" text of masked non-URL links', () => {
        const codeA = `
        /**
         * {@link SomeNode|SomeMask}
         */
        type MyTestNode = string;
        `;

        const outputA = readJsDocLink(createTestLinkNode(codeA));

        expect(outputA).toBe("**SomeNode**");

        const codeB = `
        /**
         * {@link SomeNode SomeMask}
         */
        type MyTestNode = string;
        `;

        const outputB = readJsDocLink(createTestLinkNode(codeB));

        expect(outputB).toBe("**SomeNode**");
    });

    test("returns the text of valid non-masked URL links", () => {
        const code = `
        /**
         * {@link https://www.example.com}
         */
        type MyTestNode = string;
        `;

        const output = readJsDocLink(createTestLinkNode(code));

        expect(output).toBe("https://www.example.com");
    });

    test("throws a ParserError if a non-masked URL link is invalid", () => {
        const code = `
        /**
         * {@link https://}
         */
        type MyTestNode = string;
        `;

        expect(() => readJsDocLink(createTestLinkNode(code))).toThrowError(ParserError);
    });

    test('returns the "fake" text of valid masked URL links', () => {
        const codeA = `
        /**
         * {@link https://www.example.com|SomeMask}
         */
        type MyTestNode = string;
        `;

        const outputA = readJsDocLink(createTestLinkNode(codeA));

        expect(outputA).toBe("[SomeMask](https://www.example.com)");

        const codeB = `
        /**
         * {@link https://www.example.com SomeMask}
         */
        type MyTestNode = string;
        `;

        const outputB = readJsDocLink(createTestLinkNode(codeB));

        expect(outputB).toBe("[SomeMask](https://www.example.com)");
    });

    test("throws a ParserError if a masked URL link is invalid", () => {
        const code = `
        /**
         * {@link https:// SomeMask}
         */
        type MyTestNode = string;
        `;

        expect(() => readJsDocLink(createTestLinkNode(code))).toThrowError(ParserError);
    });
});
