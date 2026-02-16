import { ValidationError } from "@/errors/ValidationError";
import type { OAS } from "@/OAS";
import { SchemaObject } from "@/schemas/base/SchemaObject";
import type { AlternateValidationFn, TypeValidationFn, ValidationFn } from "@/types/ValidationFns";
import { formatList } from "@/utils/formatList";
import { mergeAlternateValidators } from "@/utils/mergeAlternateValidators";

interface ValidationPath {
    type: TypeValidationFn<unknown>;

    extra: ValidationFn;
}

function mergeAllValidators(
    alt: AlternateValidationFn,
    paths: ValidationPath[],
    summary: string[],
): ValidationFn {
    const message = `Expected ${formatList(summary, "or")}`;

    return (input: unknown) => {
        if (alt(input)) return;

        let chosenPath: ValidationPath | null = null;

        for (const path of paths) {
            try {
                path.type(input);

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
            chosenPath.extra(input);
        } else {
            throw new ValidationError(message);
        }
    };
}

/**
 * An extended schema object with an additional method to add sub-schemas to the represented node.
 */
export class UnionTypeNodeSchema extends SchemaObject {
    private readonly schemas: SchemaObject[] = [];

    public override makeValidator(): ValidationFn {
        const alt = mergeAlternateValidators(this.schemas.map((x) => x.makeAlternateValidator()));

        const paths = this.schemas.map<ValidationPath>((x) => ({
            type: x.makeTypeValidator(),
            extra: x.makeExtraValidator(),
        }));

        const summary: string[] = [];

        for (const component of this.schemas.flatMap((x) => x.components)) {
            if (component.getValidationSummary !== undefined) {
                summary.push(...component.getValidationSummary());
            }
        }

        return mergeAllValidators(alt, paths, summary);
    }

    public override toSchema(): OAS.Schema {
        const output = super.toSchema();

        output.oneOf = this.schemas.map((x) => x.toJson());

        return output;
    }

    public addSchemas(schemas: SchemaObject[]): void {
        this.schemas.push(...schemas);
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
