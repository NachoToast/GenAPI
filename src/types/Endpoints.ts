import type { Node } from "typescript";
import type { AnySchemaObject } from "@/schemas/base/SchemaObject";
import type { RequestMethod } from "./RequestMethod";

interface BaseEndpoint {
    node: Node;

    operationId: string;

    method: RequestMethod;

    path: string;
}

export interface BasicEndpoint extends BaseEndpoint {
    requestBody?: Node | null | undefined;

    responseBody?: Node | null | undefined;

    pathParams?: Node | null | undefined;

    queryParams?: Node | null | undefined;
}

export interface ResolvedEndpoint extends BaseEndpoint {
    requestBody: AnySchemaObject | null;

    responseBody: AnySchemaObject | null;

    pathParams: AnySchemaObject | null;

    queryParams: AnySchemaObject | null;
}
