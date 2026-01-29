import type { InterfaceDeclaration } from "typescript";
import type { ReferenceDatabase } from "@/classes/ReferenceDatabase";
import { ParserError } from "@/errors/ParserError";
import type { OAS } from "@/OAS";
import type { AnyObject } from "@/types/AnyObject";
import { ObjectValidator } from "@/validators/Object";
import type { Validator } from "@/validators/Validator";
import { NamedSchemaObject } from "../NamedSchemaObject";
import type { SchemaObject } from "../SchemaObject";

/**
 * ```ts
 * interface SomeInterface {
 *   // ...
 * }
 * ```
 *
 * JSDoc:
 * - \@description
 */
export class InterfaceDeclarationSchema extends NamedSchemaObject<AnyObject> {
    private readonly properties: Record<string, SchemaObject> = {};

    public constructor(node: InterfaceDeclaration, refDb: ReferenceDatabase) {
        super({ node, type: "object", hasDescription: true, exampleFn: null }, refDb, node.name);
    }

    public override makeValidator(): Validator {
        const output = new ObjectValidator().setKeys(Object.keys(this.properties));

        for (const [key, value] of Object.entries(this.properties)) {
            try {
                output.addSubValidator(key, value.makeValidator().validate);
            } catch (error) {
                if (error instanceof RangeError) {
                    throw new ParserError(
                        this.node,
                        "Tried to create a validator for an interface that circularly references itself, this will always fail validation",
                    );
                }

                throw error;
            }
        }

        return output;
    }

    public override toSchema(): OAS.Schema {
        const output: OAS.Schema = super.toSchema();

        output.required = Object.keys(this.properties);
        output.additionalProperties = false;

        const properties: Record<string, OAS.Schema | OAS.Reference> = {};

        for (const [key, schema] of Object.entries(this.properties)) {
            properties[key] = schema.toJson();
        }

        output.properties = properties;

        return output;
    }

    public addProperty(name: string, schema: SchemaObject): void {
        this.properties[name] = schema;
    }
}
