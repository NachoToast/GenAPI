import type { Node } from "typescript";
import type { NamedSchemaObject } from "@/schemas/base/NamedSchemaObject";

/** Tracks references to schema objects for building the `#/components/schemas` JSON. */
// biome-ignore lint/suspicious/noExplicitAny: unknown doesn't work here
export type SchemaDatabase = Map<Node, NamedSchemaObject<any>>;
