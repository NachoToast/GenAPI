import type { Node, TypeNode } from "typescript";
import type { BasicEndpoint } from "./Endpoints";

export type IsRootTypeFn = (node: TypeNode | undefined) => node is TypeNode;

export interface GeneratorConfig {
    /**
     * Full path to the project's root `.ts` file.
     *
     * @example join(__dirname, "index.ts")
     */
    rootFile: string;

    /**
     * Any additional paths defined in the project's `tsconfig.json` file.
     *
     * @example { "@/*": ["./src/*"] }
     */
    pathAliases?: Record<string, string[]>;

    /** Function that returns the root type node that endpoints are generated from. */
    getRootType: (node: Node) => Node | null;

    getEndpoints(node: Node, isRootType: IsRootTypeFn): Generator<BasicEndpoint>;
}
