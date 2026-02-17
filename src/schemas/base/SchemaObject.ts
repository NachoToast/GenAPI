import { type Identifier, type Node, SyntaxKind } from "typescript";
import type { OAS } from "@/OAS";
import type { ReferenceDatabase } from "@/types/ReferenceDatabase";
import type {
    AlternateValidationFn,
    FinalValidationFn,
    TypeValidationFn,
    ValueValidationFn,
} from "@/types/ValidationFns";
import { getNodeLocation } from "@/utils/getNodeLocation";
import { makeFinalValidator, mergeAlternateValidators, mergeValidators } from "@/utils/validation";
import type { IdentifiedSchemaObject } from "./IdentifiedSchemaObject";
import type { SchemaComponent } from "./SchemaComponent";

export interface ToIdentifiedArgs {
    node: Node;

    identifier: Identifier;

    refDb: ReferenceDatabase;
}

/** Representation of an OpenAPI schema object, generated from an AST node. */
// biome-ignore lint/suspicious/noExplicitAny: unknown doesn't work here
export abstract class SchemaObject<T = any> {
    private static idCounter = 0;

    public readonly node: Node;

    public readonly components: ReadonlyArray<SchemaComponent<T>>;

    private readonly id: number;

    protected constructor(node: Node, ...components: ReadonlyArray<SchemaComponent<T>>) {
        this.node = node;
        this.components = components;
        this.id = SchemaObject.idCounter++;
    }

    public doPostInitActions(): void {
        for (const component of this.components) {
            component.postInitActions?.(this);
        }
    }

    public makeValidator(): FinalValidationFn {
        const typeValidators: TypeValidationFn<T>[] = [];
        const valueValidators: ValueValidationFn<T>[] = [];
        const alternateValidators: AlternateValidationFn[] = [];

        for (const component of this.components) {
            if (component.getTypeValidators !== undefined) {
                typeValidators.push(...component.getTypeValidators());
            }

            if (component.getValueValidators !== undefined) {
                valueValidators.push(...component.getValueValidators());
            }

            if (component.getAlternateValidators !== undefined) {
                alternateValidators.push(...component.getAlternateValidators());
            }
        }

        return makeFinalValidator(
            mergeValidators(typeValidators),
            mergeValidators(valueValidators),
            mergeAlternateValidators(alternateValidators),
        );
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

    public abstract toIdentified(args: ToIdentifiedArgs): IdentifiedSchemaObject<T>;

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

        if (this.components.length > 0) {
            const compString = this.components.map((x) => x.constructor.name).join(", ");

            yield `Components (${this.components.length}): ${compString}`;
        }
    }
}
