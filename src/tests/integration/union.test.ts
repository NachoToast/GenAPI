import { describe, expect, test } from "bun:test";
import { join } from "node:path";
import { isTypeAliasDeclaration } from "typescript";
import type { OAS } from "@/OAS";
import { TestProgram } from "../TestProgram";

describe("unions", () => {
    const program = new TestProgram(join(__dirname, "union.test.data.ts"));

    test("simple union", () => {
        const node = program.find(
            isTypeAliasDeclaration,
            (x) => x.name.escapedText === "SimpleUnion",
        );

        const handled = program.handle(node);

        expect(handled.toSchema()).toMatchObject({
            oneOf: [
                {
                    type: "string",
                },
                {
                    type: "number",
                },
            ],
            description: "Test description.",
        } satisfies OAS.Schema);
    });

    test("null union", () => {
        const node = program.find(
            isTypeAliasDeclaration,
            (x) => x.name.escapedText === "NullUnion",
        );

        const handled = program.handle(node);

        expect(handled.toSchema()).toMatchObject({
            type: "string",
            example: "test example",
            nullable: true,
        } satisfies OAS.Schema);
    });

    test("union with alias", () => {
        const node = program.find(
            isTypeAliasDeclaration,
            (x) => x.name.escapedText === "UnionWithAlias",
        );

        const handled = program.handle(node);

        expect(handled.toSchema()).toMatchObject({
            oneOf: [
                { type: "string" },
                { nullable: true },
                { $ref: "#/components/schemas/SomeAliased" },
            ],
        } satisfies OAS.Schema);
    });
});
