import { type Node, SyntaxKind } from "typescript";
import type { ReferenceDatabase } from "@/classes/ReferenceDatabase";
import { getSource } from "@/helpers/getSource";
import { getJsDocDescription } from "@/helpers/jsDoc/getJsDocDescription";
import { getJsDocExample } from "@/helpers/jsDoc/getJsDocExample";
import type { OAS } from "@/OAS";
import type { AnyObject } from "@/types/AnyObject";
import type { Validator } from "@/validators/Validator";

export type SchemaType = Exclude<OAS.Schema["type"], undefined>;

export type AnySupportedType = string | number | AnyObject;

export interface SchemaObjectArgs<T> {
    node: Node;

    type: SchemaType;

    /** Whether to try read the `@description` JSDoc tag of the {@link node}. */
    hasDescription: boolean;

    /**
     * If provided, the `@example` JSDoc tag of the {@link node} will be read and transformed by
     * the given function.
     */
    exampleFn: null | ((rawValue: string) => T);
}

export abstract class SchemaObject<T extends AnySupportedType = AnySupportedType> {
    private static idCounter = 0;

    private readonly id: number;

    public readonly node: Node;

    private readonly type: SchemaType;

    private readonly description: string | null;

    // TODO: validate this
    private readonly example: T | null;

    protected readonly refDb: ReferenceDatabase;

    protected constructor(args: SchemaObjectArgs<T>, refDb: ReferenceDatabase) {
        const { node, type, hasDescription, exampleFn } = args;

        this.id = SchemaObject.idCounter++;
        this.node = node;
        this.type = type;
        this.description = hasDescription ? getJsDocDescription(node) : null;
        this.example = exampleFn !== null ? getJsDocExample(node, exampleFn) : null;
        this.refDb = refDb;
    }

    public abstract makeValidator(): Validator;

    public toSchema(): OAS.Schema {
        const output: OAS.Schema = { type: this.type };

        if (this.description !== null) {
            output.description = this.description;
        }

        if (this.example !== null) {
            output.example = this.example;
        }

        return output;
    }

    public toJson(): OAS.Schema | OAS.Reference {
        return { type: this.type, ...this.toSchema() };
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
        yield `Type: ${this.type}`;
        yield `Source: ${getSource(this.node)}`;
    }
}
