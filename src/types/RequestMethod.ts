import type { OAS } from "@/OAS";

type OperationKeysOf<T> = {
    [K in keyof T]: NonNullable<T[K]> extends OAS.Operation ? K : never;
}[keyof T];

export type RequestMethod = Exclude<OperationKeysOf<OAS.PathItem>, undefined>;
