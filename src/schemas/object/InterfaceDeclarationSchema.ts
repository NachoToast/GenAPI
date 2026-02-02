import type { InterfaceDeclaration } from "typescript";
import type { ReferenceDatabase } from "@/classes/ReferenceDatabase";
import { ParserError } from "@/errors/ParserError";
import type { OAS } from "@/OAS";
import type { AnyObject } from "@/types/AnyObject";
import { ObjectValidator } from "@/validators/ObjectValidator";
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

    private readonly requiredKeys = new Set<string>();

    public constructor(node: InterfaceDeclaration, refDb: ReferenceDatabase) {
        super({ node, type: "object", hasDescription: true, exampleFn: null }, refDb, node.name);
    }

    public override makeValidator(): Validator {
        const output = new ObjectValidator().setRequiredKeys([...this.requiredKeys]);

        for (const [key, value] of Object.entries(this.properties)) {
            try {
                const validator = value.makeValidator();

                const fn = validator.validate;

                if (this.requiredKeys.has(key)) {
                    output.addRequiredSubValidator(key, fn);
                } else {
                    output.addOptionalSubValidator(key, fn);
                }
            } catch (error) {
                if (!(error instanceof RangeError)) {
                    throw error;
                }

                throw new ParserError(
                    this.node,
                    "Tried to create a validator for an interface that circularly references itself, this will always fail validation",
                );
            }
        }

        return output;
    }

    public override toSchema(): OAS.Schema {
        const output: OAS.Schema = super.toSchema();

        if (this.requiredKeys.size > 0) {
            output.required = [...this.requiredKeys];
        }

        output.additionalProperties = false;

        const properties: Record<string, OAS.Schema | OAS.Reference> = {};

        for (const [key, schema] of Object.entries(this.properties)) {
            properties[key] = schema.toJson();
        }

        output.properties = properties;

        return output;
    }

    public addProperty(key: string, schema: SchemaObject, isRequired: boolean): void {
        this.properties[key] = schema;

        if (isRequired) {
            this.requiredKeys.add(key);
        }
    }
}
