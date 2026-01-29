export interface ValidationFnArgs {
    requestBody: unknown;

    pathParams: unknown;

    queryParams: unknown;
}

export type ValidationFn = (args: ValidationFnArgs) => void;
