import type { SchemaComponent } from "@/schemas/base/SchemaComponent";

export function addComponentTo<T>(
    existing: SchemaComponent<T>[],
    newComponent: SchemaComponent<T>,
): void {
    for (let i = 0; i < existing.length; i++) {
        const existingComponent = existing[i];

        if (!existingComponent.conflictsWith(newComponent)) {
            continue;
        }

        if (existingComponent.tryResolveConflictWith === undefined) {
            throw new Error(`${existingComponent.getName()} cannot exist in multiple places`);
        }

        const mergeResult = existingComponent.tryResolveConflictWith(newComponent);

        if (mergeResult === null) {
            throw new Error(`${existingComponent.getName()} cannot exist in multiple places`);
        }

        existing[i] = mergeResult;
        return;
    }

    existing.push(newComponent);
}
