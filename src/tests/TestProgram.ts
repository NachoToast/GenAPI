import { createProgram, type Node, type Program } from "typescript";
import { handleNode } from "@/handlers/handleNode";
import type { SchemaObject } from "@/schemas/base/SchemaObject";
import type { HandlerArgs } from "@/types/HandlerArgs";

export class TestProgram {
    private readonly program: Program;

    private readonly args: HandlerArgs;

    public constructor(filePath: string) {
        this.program = createProgram({ rootNames: [filePath], options: {} });

        this.args = { refDb: new Map(), typeChecker: this.program.getTypeChecker() };
    }

    public find<T extends Node>(
        typePredicateFn: (node: Node) => node is T,
        valuePredicateFn?: (node: T) => boolean,
    ): T {
        for (const file of this.program.getSourceFiles()) {
            const finalNode = file.forEachChild((node) => {
                if (!typePredicateFn(node)) {
                    return;
                }

                if (valuePredicateFn !== undefined && !valuePredicateFn(node)) {
                    return;
                }

                return node;
            });

            if (finalNode !== undefined) {
                return finalNode;
            }
        }

        throw new Error("Unable to find node");
    }

    public handle(node: Node): SchemaObject {
        const result = handleNode(node, this.args);

        if (result === null) {
            throw new Error("Should not have returned null");
        }

        return result;
    }
}
