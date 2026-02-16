import type { OAS } from "@/OAS";
import type { ValidationFn } from "./ValidationFns";

export interface GeneratorReturn {
    validationMap: Map<string, ValidationFn>;

    paths: OAS.Paths;

    components: OAS.Components;
}
