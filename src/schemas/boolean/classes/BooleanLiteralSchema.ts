import type { Node } from "typescript";
import { IdentifiedSchemaObject } from "@/schemas/base/IdentifiedSchemaObject";
import { SchemaObject, type ToIdentifiedArgs } from "@/schemas/base/SchemaObject";
import { compBoolean } from "../components/compBoolean";
import { compBooleanEnum } from "../components/compBooleanEnum";

class IdentifiedBooleanLiteralSchema extends IdentifiedSchemaObject<boolean> {
    private readonly values: boolean[];

    public constructor(
        args: ToIdentifiedArgs,
        previous: IdentifiedBooleanLiteralSchema | null,
        values: boolean[],
    ) {
        super(args, previous, compBoolean, compBooleanEnum(values));
        this.values = values;
    }

    public override toIdentified(args: ToIdentifiedArgs): IdentifiedSchemaObject<boolean> {
        return new IdentifiedBooleanLiteralSchema(args, this, this.values);
    }
}

export class BooleanLiteralSchema extends SchemaObject<boolean> {
    private readonly value: boolean;

    public constructor(node: Node, value: boolean) {
        super(node, compBoolean, compBooleanEnum([value]));
        this.value = value;
    }

    public override toIdentified(args: ToIdentifiedArgs): IdentifiedSchemaObject<boolean> {
        return new IdentifiedBooleanLiteralSchema(args, null, [this.value]);
    }
}
