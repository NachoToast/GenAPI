import { type Node, SyntaxKind } from "typescript";
import type { OAS } from "@/OAS";
import type { AlternateValidationFn, TypeValidationFn, ValidationFn } from "@/types/ValidationFns";
import { getNodeLocation } from "@/utils/getNodeLocation";
import { mergeAlternateValidators } from "@/utils/mergeAlternateValidators";
import { mergeValidators } from "@/utils/mergeValidators";
import type { ReferenceDatabase } from "../../types/ReferenceDatabase";
import type { SchemaComponent } from "./SchemaComponent";
import { SchemaFlag } from "./SchemaFlag";

function mergeAllValidators<T>(
    type: TypeValidationFn<T>,
    extra: ValidationFn<T>,
    alt: AlternateValidationFn,
): ValidationFn<T> {
    return (input: unknown) => {
        if (alt(input)) return;

        type(input);

        extra(input);
    };
}

/** Representation of an OpenAPI schema object, generated from an AST node. */
// biome-ignore lint/suspicious/noExplicitAny: unknown doesn't work here
export class SchemaObject<T = any> {
    private static idCounter = 0;

    public readonly node: Node;

    public readonly refDb: ReferenceDatabase;

    public readonly components: ReadonlyArray<SchemaComponent<T>>;

    private readonly id: number;

    private readonly flags: ReadonlySet<SchemaFlag>;

    public constructor(
        node: Node,
        refDb: ReferenceDatabase,
        ...components: ReadonlyArray<SchemaComponent<T>>
    ) {
        this.node = node;
        this.refDb = refDb;
        this.components = components;
        this.id = SchemaObject.idCounter++;

        const flags = new Set<SchemaFlag>();

        for (const component of this.components) {
            if (component.getFlags !== undefined) {
                for (const flag of component.getFlags()) {
                    flags.add(flag);
                }
            }
        }

        this.flags = flags;
    }

    public doPostInitActions(): void {
        for (const component of this.components) {
            component.postInitActions?.(this);
        }
    }

    public hasFlag(flag: SchemaFlag): boolean {
        return this.flags.has(flag);
    }

    public makeValidator(): ValidationFn<T> {
        return mergeAllValidators(
            this.makeTypeValidator(),
            this.makeExtraValidator(),
            this.makeAlternateValidator(),
        );
    }

    public makeTypeValidator(): TypeValidationFn<T> {
        const validators: TypeValidationFn<T>[] = [];

        for (const component of this.components) {
            if (component.getTypeValidators !== undefined) {
                validators.push(...component.getTypeValidators());
            }
        }

        return mergeValidators(validators);
    }

    public makeExtraValidator(): ValidationFn<T> {
        const validators: ValidationFn<T>[] = [];

        for (const component of this.components) {
            if (component.getExtraValidators !== undefined) {
                validators.push(...component.getExtraValidators());
            }
        }

        return mergeValidators(validators);
    }

    public makeAlternateValidator(): AlternateValidationFn {
        const validators: AlternateValidationFn[] = [];

        for (const component of this.components) {
            if (component.getAlternateValidators !== undefined) {
                validators.push(...component.getAlternateValidators());
            }
        }

        return mergeAlternateValidators(validators);
    }

    public toSchema(): OAS.Schema {
        const output: OAS.Schema = {};

        for (const component of this.components) {
            component.doSchemaActions?.(output);
        }

        return output;
    }

    public toJson(): OAS.Schema | OAS.Reference {
        return this.toSchema();
    }

    public toStringShort(): string {
        const parts = this.getShortStringParts().toArray().join(",");

        return `${this.constructor.name}(${parts})`;
    }

    public toStringLong(): string {
        const parts = this.getLongStringParts().toArray().join("\n\t");

        return `${this.constructor.name}({\n\t${parts}\n})`;
    }

    protected *getShortStringParts(): Generator<string> {
        yield `id:${this.id}`;
    }

    protected *getLongStringParts(): Generator<string> {
        yield `ID: ${this.id}`;
        yield `Node: ${SyntaxKind[this.node.kind]}`;
        yield `Source: ${getNodeLocation(this.node)}`;

        if (this.flags.size > 0) {
            const flagString = this.flags
                .values()
                .toArray()
                .map((x) => SchemaFlag[x])
                .join(", ");

            yield `Flags (${this.flags.size}): ${flagString}`;
        }

        if (this.components.length > 0) {
            const compString = this.components.map((x) => x.constructor.name).join(", ");
            yield `Components (${this.components.length}): ${compString}`;
        }
    }
}
