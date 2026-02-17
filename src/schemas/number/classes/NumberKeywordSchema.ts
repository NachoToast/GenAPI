import type { Node } from "typescript";
import { getJsDocTag } from "@/jsDoc/getJsDocTag";
import { IdentifiedSchemaObject } from "@/schemas/base/IdentifiedSchemaObject";
import { SchemaObject, type ToIdentifiedArgs } from "@/schemas/base/SchemaObject";
import { compInteger } from "../components/compInteger";
import { compMinimum } from "../components/compMinimum";
import { compNumber } from "../components/compNumber";

class IdentifiedNumberKeywordSchema extends IdentifiedSchemaObject<number> {
    private readonly isInteger: boolean;

    public constructor(
        args: ToIdentifiedArgs,
        previous: IdentifiedNumberKeywordSchema | null,
        isInteger: boolean,
    ) {
        const { node } = args;

        super(
            args,
            previous,
            isInteger ? compInteger : compNumber,
            compMinimum(node, isInteger),
            compMinimum(node, isInteger),
        );

        this.isInteger = isInteger;
    }

    public override toIdentified(args: ToIdentifiedArgs): IdentifiedSchemaObject<number> {
        return new IdentifiedNumberKeywordSchema(args, this, this.isInteger);
    }
}

export class NumberKeywordSchema extends SchemaObject<number> {
    private readonly isInteger: boolean;

    public constructor(node: Node) {
        const isInteger = getJsDocTag(node, "integer", (x) => x.string()) !== null;

        super(node, isInteger ? compInteger : compNumber);

        this.isInteger = isInteger;
    }

    public override toIdentified(args: ToIdentifiedArgs): IdentifiedSchemaObject<number> {
        return new IdentifiedNumberKeywordSchema(args, null, this.isInteger);
    }
}
