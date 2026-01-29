import type { Node } from "typescript";
import type { SchemaObject } from "@/schemas/SchemaObject";
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
    requestBody: SchemaObject | null;

    responseBody: SchemaObject | null;

    pathParams: SchemaObject | null;

    queryParams: SchemaObject | null;
}
