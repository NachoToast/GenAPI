import { type CompEnum, compEnum } from "@/schemas/base/components/compEnum";

export function compBooleanEnum(...values: boolean[]): CompEnum<boolean> {
    return compEnum(values, (x) => x.toString());
}
