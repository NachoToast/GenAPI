import { type CompEnum, compEnum } from "@/schemas/base/components/compEnum";

export function compStringEnum(...values: string[]): CompEnum<string> {
    return compEnum(values, (x) => `"${x}"`);
}
