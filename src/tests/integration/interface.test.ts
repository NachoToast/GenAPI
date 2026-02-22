import { describe, expect, test } from "bun:test";
import { join } from "node:path";
import { isInterfaceDeclaration } from "typescript";
import type { OAS } from "@/OAS";
import { TestProgram } from "../TestProgram";

describe("interfaces", () => {
    const program = new TestProgram(join(__dirname, "interface.test.data.ts"));

    test("simple interface", () => {
        const node = program.find(
            isInterfaceDeclaration,
            (x) => x.name.escapedText === "MyInterface",
        );

        const handled = program.handle(node);

        program.clearDb();

        expect(handled.toSchema()).toMatchObject({
            type: "object",
            properties: {
                keyA: {
                    type: "boolean",
                    example: true,
                },
                keyB: {
                    type: "string",
                    nullable: true,
                },
                keyC: {
                    type: "number",
                    example: 19,
                },
            },
            required: ["keyA", "keyB"],
            additionalProperties: false,
        } satisfies OAS.Schema);
    });
});
