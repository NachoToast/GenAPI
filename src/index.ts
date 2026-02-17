import {
    type CompilerOptions,
    createProgram,
    isTypeReferenceNode,
    type Node,
    type Program,
    type TypeNode,
} from "typescript";
import { ParserError } from "./errors/ParserError";
import { handleNode } from "./handlers/handleNode";
import { getReferencedType } from "./helpers/getReferencedType";
import { getJsDocDescription } from "./jsDoc/getJsDocDescription";
import { getJsDocTag } from "./jsDoc/getJsDocTag";
import type { OAS } from "./OAS";
import type { IdentifiedSchemaObject } from "./schemas/base/IdentifiedSchemaObject";
import type { SchemaObject } from "./schemas/base/SchemaObject";
import type { ResolvedEndpoint } from "./types/Endpoints";
import type { GeneratorConfig } from "./types/GeneratorConfig";
import type { GeneratorReturn } from "./types/GeneratorReturn";
import type { HandlerArgs } from "./types/HandlerArgs";
import type { ReferenceDatabase } from "./types/ReferenceDatabase";
import type { FinalValidationFn } from "./types/ValidationFns";
import { getNodeLocation } from "./utils/getNodeLocation";

function makeProgram({ rootFile, pathAliases }: GeneratorConfig): Program {
    const options: CompilerOptions = {};

    if (pathAliases !== undefined) {
        options.paths = pathAliases;
    }

    return createProgram({ rootNames: [rootFile], options });
}

function findRootType(program: Program, config: GeneratorConfig): Node {
    const { rootTypeFile, getRootType } = config;

    const file = program.getSourceFile(rootTypeFile);

    if (file === undefined) {
        throw new Error("Unable to find the root type file");
    }

    const found = file.forEachChild((node) => getRootType(node));

    if (found) {
        return found;
    }

    throw new Error("Unable to find the root type node");
}

function prepareReferences(refDb: ReferenceDatabase): Record<string, OAS.Schema> {
    // Clear any schemas that are only referenced once

    const keptSchemas: IdentifiedSchemaObject[] = [];

    for (const [key, schema] of refDb.entries()) {
        if (schema.referenceCount < 2) {
            refDb.delete(key);
        }
    }

    // Set discriminator values to avoid duplicate names.

    const schemasByName = new Map<string, IdentifiedSchemaObject>();

    for (const schema of keptSchemas) {
        const name = schema.getBaseName();

        const sameNamed = schemasByName.get(name);

        if (sameNamed !== undefined) {
            schema.discriminator = sameNamed.discriminator + 1;
        }

        schemasByName.set(name, schema);
    }

    const output: Record<string, OAS.Schema> = {};

    for (const schema of refDb.values()) {
        output[schema.getFullName()] = schema.toSchema();
    }

    return output;
}

function makeValidationMap(_endpoints: ResolvedEndpoint[]): Map<string, FinalValidationFn> {
    const output = new Map<string, FinalValidationFn>();

    // for (const endpoint of endpoints) {
    // const validationFns: ((args: ValidationFnArgs) => void)[] = [];

    // const requestValidator = endpoint.requestBody?.makeValidator();

    // todo
    // if (requestValidator !== undefined) {
    //     validationFns.push((args) => requestValidator.validate(args.requestBody));
    // }

    // const pathValidator = endpoint.pathParams?.makeValidator();

    // if (pathValidator !== undefined) {
    //     validationFns.push((args) => pathValidator.validate(args.pathParams));
    // }

    // const queryValidator = endpoint.queryParams?.makeValidator();

    // if (queryValidator !== undefined) {
    //     validationFns.push((args) => queryValidator.validate(args.queryParams));
    // }

    // if (validationFns.length > 0) {
    //     output.set(`${endpoint.method}:${endpoint.path}`, (args) => {
    //         for (const fn of validationFns) {
    //             fn(args);
    //         }
    //     });
    // }
    // }

    return output;
}

function getRequestBody(endpoint: ResolvedEndpoint): OAS.RequestBody | null {
    if (endpoint.requestBody === null) {
        return null;
    }

    return {
        required: true,
        content: { "application/json": { schema: endpoint.requestBody.toJson() } },
    };
}

function getResponse(endpoint: ResolvedEndpoint): OAS.Response {
    const description = getJsDocDescription(endpoint.node);
    const customContentType = getJsDocTag(endpoint.node, "@contentType", (x) => x.string());
    const example = getJsDocTag(endpoint.node, "@example", (x) => x.string());

    if (description === null) {
        // TODO: read @returns
        throw new ParserError(endpoint.node, "Responses must have descriptions!");
    }

    const mediaType: OAS.MediaType = {};

    if (example !== null) {
        mediaType.example = example;
    }

    if (endpoint.responseBody !== null) {
        mediaType.schema = endpoint.responseBody.toJson();
    }

    if (customContentType !== null) {
        // not sure how this doesn't give a type error...
        return { description, content: { [customContentType]: mediaType } };
    }

    return { description, content: { "application/json": mediaType } };
}

function finaliseEndpoints(endpoints: ResolvedEndpoint[]): OAS.Paths {
    const output: OAS.Paths = {};

    for (const endpoint of endpoints) {
        const operation: OAS.Operation = {
            operationId: endpoint.operationId,
            responses: { "200": getResponse(endpoint) },
            externalDocs: {
                url: getNodeLocation(endpoint.node),
                description: endpoint.node.getSourceFile().fileName,
            },
        };

        const requestBody = getRequestBody(endpoint);

        if (requestBody !== null) {
            operation.requestBody = requestBody;
        }

        if (output[endpoint.path] === undefined) {
            output[endpoint.path] = { [endpoint.method]: operation };
        } else {
            output[endpoint.path][endpoint.method] = operation;
        }
    }

    return output;
}

function generateInternal(config: GeneratorConfig): GeneratorReturn {
    const program = makeProgram(config);

    const typeChecker = program.getTypeChecker();

    const rootType = findRootType(program, config);

    const endpoints: ResolvedEndpoint[] = [];

    const refDb: ReferenceDatabase = new Map();

    const handlerArgs: HandlerArgs = { refDb, typeChecker };

    function isRootType(node: TypeNode | undefined): node is TypeNode {
        if (node === undefined || !isTypeReferenceNode(node)) {
            return false;
        }

        return getReferencedType(node, typeChecker) === rootType;
    }

    function handleUserNode(node: Node | undefined | null): SchemaObject | null {
        return node ? handleNode(node, handlerArgs) : null;
    }

    for (const file of program.getSourceFiles()) {
        if (file.isDeclarationFile) continue;

        file.forEachChild((node) => {
            for (const endpoint of config.getEndpoints(node, isRootType)) {
                endpoints.push({
                    ...endpoint,
                    requestBody: handleUserNode(endpoint.requestBody),
                    responseBody: handleUserNode(endpoint.responseBody),
                    pathParams: handleUserNode(endpoint.pathParams),
                    queryParams: handleUserNode(endpoint.queryParams),
                });
            }
        });
    }

    const schemas = prepareReferences(refDb);

    return {
        validationMap: makeValidationMap(endpoints),
        paths: finaliseEndpoints(endpoints),
        components: { schemas },
    };
}

export function generate(config: GeneratorConfig): GeneratorReturn {
    try {
        return generateInternal(config);
    } catch (error) {
        if (!(error instanceof ParserError)) {
            throw error;
        }

        throw error.makeChild();
    }
}
