import type { Node } from "typescript";
import type { IdentifiedSchemaObject } from "../schemas/base/IdentifiedSchemaObject";

/** Tracks references to schema objects for building the `#/components/schemas` JSON. */
export type ReferenceDatabase = Map<Node, IdentifiedSchemaObject>;
