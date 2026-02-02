import { describe, expect, test } from "bun:test";
import { ParserError } from "@/errors/ParserError";
import { createDefaultTestNode } from "@/tests/createDefaultTestNode";
import { JsDocNumber } from "./JsDocNumber";

describe(JsDocNumber.name, () => {
    const node = createDefaultTestNode();

    describe(JsDocNumber.prototype.min.name, () => {
        const instance = new JsDocNumber(node, "someTag", 12);

        test("does nothing if its value is above or equal to the specified minimum", () => {
            instance.min(11);
            instance.min(12);
        });

        test("throws a ParserError if its value is below the specified minimum", () => {
            expect(() => instance.min(13)).toThrowError(ParserError);
        });
    });
});
