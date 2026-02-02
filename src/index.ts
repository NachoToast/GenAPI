import {
    type CompilerOptions,
    createProgram,
    isTypeReferenceNode,
    type Node,
    type Program,
    type TypeNode,
} from "typescript";
import { ReferenceDatabase } from "./classes/ReferenceDatabase";
import { ParserError } from "./errors/ParserError";
import { handleNode } from "./handlers/handleNode";
import { getReferencedType } from "./helpers/getReferencedType";
import { getSource } from "./helpers/getSource";
import { getJsDocDescription } from "./jsDoc/getJsDocDescription";
import { getJsDocTag } from "./jsDoc/getJsDocTag";
import type { OAS } from "./OAS";
import type { SchemaObject } from "./schemas/SchemaObject";
import type { ResolvedEndpoint } from "./types/Endpoints";
import type { GeneratorConfig } from "./types/GeneratorConfig";
import type { GeneratorReturn } from "./types/GeneratorReturn";
import type { HandlerArgs } from "./types/HandlerArgs";
import type { ValidationFn, ValidationFnArgs } from "./types/ValidationFn";

function makeProgram({ rootFile, pathAliases }: GeneratorConfig): Program {
    const options: CompilerOptions = {};

    if (pathAliases !== undefined) {
        options.paths = pathAliases;
    }

    return createProgram({ rootNames: [rootFile], options });
}

function findRootType(program: Program, getRootTypeFn: GeneratorConfig["getRootType"]): Node {
    for (const file of program.getSourceFiles()) {
        if (file.isDeclarationFile) {
            continue;
        }

        const found = file.forEachChild((node) => getRootTypeFn(node));

        if (found) {
            return found;
        }
    }

    throw new Error("Unable to find the root type node");
}

function makeValidationMap(endpoints: ResolvedEndpoint[]): Map<string, ValidationFn> {
    const output = new Map<string, ValidationFn>();

    for (const endpoint of endpoints) {
        const validationFns: ((args: ValidationFnArgs) => void)[] = [];

        const requestValidator = endpoint.requestBody?.makeValidator();

        if (requestValidator !== undefined) {
            validationFns.push((args) => requestValidator.validate(args.requestBody));
        }

        const pathValidator = endpoint.pathParams?.makeValidator();

        if (pathValidator !== undefined) {
            validationFns.push((args) => pathValidator.validate(args.pathParams));
        }

        const queryValidator = endpoint.queryParams?.makeValidator();

        if (queryValidator !== undefined) {
            validationFns.push((args) => queryValidator.validate(args.queryParams));
        }

        if (validationFns.length > 0) {
            output.set(`${endpoint.method}:${endpoint.path}`, (args) => {
                for (const fn of validationFns) {
                    fn(args);
                }
            });
        }
    }

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
                url: getSource(endpoint.node),
                description: endpoint.node.getSourceFile().fileName,
            },
        };

        const requestBody = getRequestBody(endpoint);

        if (requestBody !== null) {
            operation.requestBody = requestBody;
        }

        if (output[endpoint.path] === undefined) {
            output[endpoint.path] = {
                [endpoint.method]: operation,
            };
        } else {
            output[endpoint.path][endpoint.method] = operation;
        }
    }

    return output;
}

function generateInternal(config: GeneratorConfig): GeneratorReturn {
    const program = makeProgram(config);

    const typeChecker = program.getTypeChecker();

    const rootType = findRootType(program, config.getRootType);

    const endpoints: ResolvedEndpoint[] = [];

    const refDb = new ReferenceDatabase();

    const handlerArgs: HandlerArgs = { refDb, typeChecker };

    function isRootType(node: TypeNode | undefined): node is TypeNode {
        if (node === undefined || !isTypeReferenceNode(node)) {
            return false;
        }

        return getReferencedType(node, typeChecker) === rootType;
    }

    function handleNodeInternal(node: Node | undefined | null): SchemaObject | null {
        return node ? handleNode(node, handlerArgs) : null;
    }

    for (const file of program.getSourceFiles()) {
        if (file.isDeclarationFile) continue;

        file.forEachChild((node) => {
            for (const endpoint of config.getEndpoints(node, isRootType)) {
                endpoints.push({
                    ...endpoint,
                    requestBody: handleNodeInternal(endpoint.requestBody),
                    responseBody: handleNodeInternal(endpoint.responseBody),
                    pathParams: handleNodeInternal(endpoint.pathParams),
                    queryParams: handleNodeInternal(endpoint.queryParams),
                });
            }
        });
    }

    handlerArgs.refDb.clearSingles();

    const schemas = refDb.getAll();

    return {
        validationMap: makeValidationMap(endpoints),
        paths: finaliseEndpoints(endpoints),
        components: { schemas },
    };

    // for (const endpoint of endpoints) {
    //     console.log(
    //         [
    //             `${endpoint.operationId} ${getSource(endpoint.node)}`,
    //             [
    //                 endpoint.requestBody?.toJson(),
    //                 endpoint.responseBody?.toJson(),
    //                 endpoint.pathParams?.toJson(),
    //                 endpoint.queryParams?.toJson(),
    //             ]
    //                 .filter((x) => x !== undefined)
    //                 .map(
    //                     (x, i) =>
    //                         `${["ReqBody", "ResBody", "Path", "Query"][i]} ${JSON.stringify(
    //                             x,
    //                             undefined,
    //                             4,
    //                         )
    //                             .split("\n")
    //                             .map((y) => y.trim())
    //                             .join(" ")}`,
    //                 )
    //                 .join("\n"),
    //         ].join("\n"),
    //     );
    // }

    // console.log(handlerArgs.refDb.toStringFull());

    // console.log(JSON.stringify(handlerArgs.refDb.getAll(), undefined, 4));

    // console.log(handlerArgs.refDb.toStringFull());
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
