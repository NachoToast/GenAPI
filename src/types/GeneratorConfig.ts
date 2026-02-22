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

    /**
     * Full path to the TypeScript file where the root endpoint type is located.
     *
     * This is used alongside {@link getRootType}.
     *
     * @example join(__dirname, "types", "Endpoint.ts")
     */
    rootTypeFile: string;

    /**
     * How to handle nodes that aren't supported by the generator.
     *
     * - `silence` - Unsupported nodes will be omitted entirely, no errors will be logged. Only use
     * this if you're debugging something else and don't want unrelated errors in your console.
     * - `log` - Unsupported nodes will be logged to the console, but will not prevent further
     * generation.
     * - `error` - Unsupported nodes will be logged to the console and halt the generation process
     * entirely. **This is the recommended option.**
     */
    unsupportedBehaviour: "silence" | "log" | "error";

    /**
     * Function that returns the root type node that endpoints are generated from.
     *
     * Note that this is only called on nodes in the {@link rootTypeFile}.
     */
    getRootType(node: Node): TypeNode | null;

    getEndpoints(node: Node, isRootType: IsRootTypeFn): Generator<BasicEndpoint>;
}
