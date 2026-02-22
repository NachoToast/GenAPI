import type { Node } from "typescript";
import { getJsDocTag } from "@/jsDoc/getJsDocTag";
import { NamedSchemaObject, type NamedSchemaObjectArgs } from "@/schemas/base/NamedSchemaObject";
import type { SchemaComponent } from "@/schemas/base/SchemaComponent";
import { SchemaObject } from "@/schemas/base/SchemaObject";
import { compInteger } from "../components/compInteger";
import { compMaximum } from "../components/compMaximum";
import { compMinimum } from "../components/compMinimum";
import { compNumber } from "../components/compNumber";
import { compNumberExample } from "../components/compNumberExample";

class NamedNumberKeywordSchema extends NamedSchemaObject<number> {
    private readonly isInteger: boolean;

    public constructor(
        args: NamedSchemaObjectArgs,
        components: SchemaComponent<number>[],
        isInteger: boolean,
    ) {
        super(args, components);
        this.isInteger = isInteger;
    }

    protected override *getExtraComponents(node: Node): Generator<SchemaComponent<number> | null> {
        yield* super.getExtraComponents(node);
        yield compNumberExample(node);
        yield compMinimum(node, this.isInteger);
        yield compMaximum(node, this.isInteger);
    }
}

export class NumberKeywordSchema extends SchemaObject<number> {
    public constructor(node: Node) {
        super(node, [compNumber]);
    }

    public override toNamed(args: NamedSchemaObjectArgs): NamedSchemaObject<number> {
        const isInteger = getJsDocTag(args.node, "integer", (x) => x.string()) !== null;

        const typeComp = isInteger ? compInteger : compNumber;

        return new NamedNumberKeywordSchema(args, [typeComp], isInteger);
    }
}
