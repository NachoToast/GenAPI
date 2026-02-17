import type { StringLiteral } from "typescript";
import { IdentifiedSchemaObject } from "@/schemas/base/IdentifiedSchemaObject";
import { SchemaObject, type ToIdentifiedArgs } from "@/schemas/base/SchemaObject";
import { compString } from "../components/compString";
import { compStringEnum } from "../components/compStringEnum";

class IdentifiedStringLiteralSchema extends IdentifiedSchemaObject<string> {
    private readonly values: string[];

    public constructor(
        args: ToIdentifiedArgs,
        previous: IdentifiedStringLiteralSchema | null,
        values: string[],
    ) {
        super(args, previous, compString, compStringEnum(values));
        this.values = values;
    }

    public override toIdentified(args: ToIdentifiedArgs): IdentifiedSchemaObject<string> {
        return new IdentifiedStringLiteralSchema(args, this, this.values);
    }
}

export class StringLiteralSchema extends SchemaObject<string> {
    private readonly value: string;

    public constructor(node: StringLiteral) {
        const value = node.text;

        super(node, compString, compStringEnum([value]));

        this.value = value;
    }

    public override toIdentified(args: ToIdentifiedArgs): IdentifiedSchemaObject<string> {
        return new IdentifiedStringLiteralSchema(args, null, [this.value]);
    }
}
