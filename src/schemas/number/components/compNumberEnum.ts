import { type CompEnum, compEnum } from "@/schemas/base/components/compEnum";

export function compNumberEnum(...values: number[]): CompEnum<number> {
    return compEnum(values, (x) => x.toString());
}
