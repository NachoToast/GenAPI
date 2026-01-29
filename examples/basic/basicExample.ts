import type { Endpoint } from "./Endpoint";
import type { SharedInterfaceA, SharedInterfaceB } from "./Shared";
import "./duplicate";

/** Simple string endpoint. */
export const simpleStringEndpoint: Endpoint<"some-literal", string> = {
    method: "get",
    path: "/simple/string",
};

/** Simple number endpoint. */
export const simpleNumberEndpoint: Endpoint<1730, number> = {
    method: "get",
    path: "/simple/number",
};

type StringAlias = "";

type NumberAlias = number;

/** Simple alias endpoint. */
export const simpleAliasEndpoint: Endpoint<StringAlias, NumberAlias> = {
    method: "get",
    path: "/simple/alias",
};

/**
 * Basic endpoint using {@link SharedInterfaceA} and {@link SharedInterfaceB}.
 *
 * @returns Some description of the response.
 */
export const endpointOne: Endpoint<SharedInterfaceA, SharedInterfaceB> = {
    method: "post",
    path: "/some/path",
};

interface IsolatedInterfaceA {
    foo: "bar";
}

/** Another endpoint, this one uses {@link IsolatedInterfaceA}. */
export const endpointTwo: Endpoint<void, IsolatedInterfaceA, { id: string }> = {
    method: "get",
    path: "/users/:id",
};

/**
 * Endpoint which returns it's own custom response, denoted in JsDoc.
 *
 * @returns Some returns description.
 * @example "some.example.string"
 * @contentType text/html
 */
export const endpointThree: Endpoint<
    string,
    number,
    Record<string, never>,
    { queryString: string }
> = {
    method: "post",
    path: "/three",
};

/** Endpoint four. */
export const endpointFour: Endpoint<SharedInterfaceA, SharedInterfaceA> = {
    method: "post",
    path: "/four",
};
