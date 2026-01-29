export type RequestMethod = "get" | "post";

export interface Endpoint<
    _RequestBody = void,
    _ResponseBody = void,
    _PathParams extends Record<string, string> = Record<string, never>,
    _QueryParams extends Record<string, string> = Record<string, never>,
> {
    method: RequestMethod;

    path: string;
}
