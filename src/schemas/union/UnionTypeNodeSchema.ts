import type { UnionTypeNode } from "typescript";
import { ValidationError } from "@/errors/ValidationError";
import type { OAS } from "@/OAS";
import type {
    AlternateValidationFn,
    FinalValidationFn,
    TypeValidationFn,
    ValueValidationFn,
} from "@/types/ValidationFns";
import { formatList } from "@/utils/formatList";
import { mergeAlternateValidators, mergeValidators } from "@/utils/validation";
import { NamedSchemaObject, type NamedSchemaObjectArgs } from "../base/NamedSchemaObject";
import { type AnySchemaObject, SchemaObject } from "../base/SchemaObject";

interface ValidationPath {
    typeValidator: TypeValidationFn<unknown>;

    valueValidator: ValueValidationFn<unknown>;
}

function makeFinalValidator(
    validationPaths: ValidationPath[],
    alternateValidator: AlternateValidationFn,
    message: string,
): FinalValidationFn {
    return (input: unknown) => {
        if (alternateValidator(input)) return;

        let chosenPath: ValidationPath | null = null;

        for (const path of validationPaths) {
            try {
                path.typeValidator(input);

                chosenPath = path;
                break;
            } catch (error) {
                if (!(error instanceof ValidationError)) {
                    throw error;
                }

                // Swallow validation errors here, since we wouldn't know which one to show.
            }
        }

        if (chosenPath !== null) {
            chosenPath.valueValidator(input);
        } else {
            throw new ValidationError(message);
        }
    };
}

function makeUnionValidator(schemas: AnySchemaObject[]): FinalValidationFn {
    const alternateValidators: AlternateValidationFn[] = [];
    const validationPaths: ValidationPath[] = [];
    const validationSummary: string[] = [];

    for (const schema of schemas) {
        const typeValidators: TypeValidationFn<unknown>[] = [];
        const valueValidators: ValueValidationFn<unknown>[] = [];

        for (const component of schema.components) {
            if (component.getTypeValidators !== undefined) {
                typeValidators.push(...component.getTypeValidators());
            }

            if (component.getValueValidators !== undefined) {
                valueValidators.push(...component.getValueValidators());
            }

            if (component.getAlternateValidators !== undefined) {
                alternateValidators.push(...component.getAlternateValidators());
            }

            if (component.getTypeValidationSummary !== undefined) {
                validationSummary.push(...component.getTypeValidationSummary());
            }
        }

        validationPaths.push({
            typeValidator: mergeValidators(typeValidators),
            valueValidator: mergeValidators(valueValidators),
        });
    }

    const alternateValidator = mergeAlternateValidators(alternateValidators);

    const message = `Expected ${formatList(validationSummary, "or")}`;

    return makeFinalValidator(validationPaths, alternateValidator, message);
}

class IdentifiedUnionTypeNodeSchema extends NamedSchemaObject<unknown> {
    private readonly schemas: AnySchemaObject[];

    public constructor(args: NamedSchemaObjectArgs, schemas: AnySchemaObject[]) {
        super(args, []);
        this.schemas = schemas;
    }

    public override makeValidator(): FinalValidationFn {
        return makeUnionValidator(this.schemas);
    }

    public override toSchema(): OAS.Schema {
        const output = super.toSchema();

        output.oneOf = this.schemas.map((x) => x.toJson());

        return output;
    }

    protected override *getShortStringParts(): Generator<string> {
        yield* super.getShortStringParts();
        yield `schemas:${this.schemas.length}`;
    }

    protected override *getLongStringParts(): Generator<string> {
        yield* super.getLongStringParts();
        yield `Schemas (${this.schemas.length}): ${this.schemas.map((x) => x.toStringShort()).join(", ")}`;
    }
}

export class UnionTypeNodeSchema extends SchemaObject<unknown> {
    private readonly schemas: AnySchemaObject[];

    public constructor(node: UnionTypeNode, schemas: AnySchemaObject[]) {
        super(node, []);
        this.schemas = schemas;
    }

    public override toNamed(args: NamedSchemaObjectArgs): NamedSchemaObject<unknown> {
        return new IdentifiedUnionTypeNodeSchema(args, this.schemas);
    }

    public override makeValidator(): FinalValidationFn {
        return makeUnionValidator(this.schemas);
    }

    public override toSchema(): OAS.Schema {
        const output = super.toSchema();

        output.oneOf = this.schemas.map((x) => x.toJson());

        return output;
    }

    protected override *getShortStringParts(): Generator<string> {
        yield* super.getShortStringParts();
        yield `schemas:${this.schemas.length}`;
    }

    protected override *getLongStringParts(): Generator<string> {
        yield* super.getLongStringParts();
        yield `Schemas (${this.schemas.length}): ${this.schemas.map((x) => x.toStringShort()).join(", ")}`;
    }
}
