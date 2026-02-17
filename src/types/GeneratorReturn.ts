import type { OAS } from "@/OAS";
import type { FinalValidationFn } from "./ValidationFns";

export interface GeneratorReturn {
    validationMap: Map<string, FinalValidationFn>;

    paths: OAS.Paths;

    components: OAS.Components;
}
