import type { Endpoint } from "./Endpoint";

type NumberAlias = 939;

/**
 * A string alias.
 *
 * @minLength 3
 * @example "678"
 */
type StringAlias = string;

/** My endpoint description wow. */
export const duplicateEndpoint: Endpoint<NumberAlias, StringAlias> = {
    method: "get",
    path: "/duplicate",
};
