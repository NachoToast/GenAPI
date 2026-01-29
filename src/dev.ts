import { writeFileSync } from "node:fs";
import { join } from "node:path";
import {
    isInterfaceDeclaration,
    isObjectLiteralExpression,
    isVariableStatement,
    type Node,
} from "typescript";
import { generate } from ".";
import { ParserError } from "./errors/ParserError";
import { asRequestMethod } from "./helpers/asRequestMethod";
import { getAllGenerics } from "./helpers/getAllGenerics";
import { getFirstDeclaration } from "./helpers/getFirstDeclaration";
import { getPropertyValueString } from "./helpers/getPropertyValueString";
import { getVariableName } from "./helpers/getVariableName";
import type { OAS } from "./OAS";
import type { BasicEndpoint } from "./types/Endpoints";
import type { IsRootTypeFn } from "./types/GeneratorConfig";
import type { GeneratorReturn } from "./types/GeneratorReturn";
import "../examples/basic/basicExample";

function getRootType(node: Node): Node | null {
    if (isInterfaceDeclaration(node) && node.name.escapedText === "Endpoint") {
        return node;
    }

    return null;
}

function* getHandlers(node: Node, isRootType: IsRootTypeFn): Generator<BasicEndpoint> {
    if (!isVariableStatement(node)) {
        return;
    }

    const endpoint = getFirstDeclaration(node);

    const { type, initializer } = endpoint;

    if (!isRootType(type)) {
        return;
    }

    if (initializer === undefined) {
        throw new ParserError(endpoint, "Expected Endpoint to be initialised");
    }

    if (!isObjectLiteralExpression(initializer)) {
        throw new ParserError(
            initializer,
            "Expected Endpoint to be initialised with an object literal expression",
        );
    }

    const generics = getAllGenerics(type, true);

    yield {
        node,
        operationId: getVariableName(node),
        method: asRequestMethod(node, getPropertyValueString(initializer, "method", true)),
        path: getPropertyValueString(initializer, "path", true),
        requestBody: generics.at(0),
        responseBody: generics.at(1),
        pathParams: generics.at(2),
        queryParams: generics.at(3),
    };
}

const startTime: number = Date.now();

const { components, paths }: GeneratorReturn = generate({
    rootFile: join(__dirname, "..", "examples", "basic", "basicExample.ts"),
    getRootType,
    getEndpoints: getHandlers,
});

console.log(`Generation Complete after ${Date.now() - startTime}ms`);

writeFileSync(
    join(__dirname, "test.openapi.json"),
    JSON.stringify(
        {
            $schema: "../.github/openapi.schema.json",
            openapi: "3.0.3",
            info: {
                title: "Test Generated Schema",
                version: "1.0.0",
            },
            paths,
            components,
        } satisfies OAS.RootDocument,
        undefined,
        4,
    ),
    "utf-8",
);
