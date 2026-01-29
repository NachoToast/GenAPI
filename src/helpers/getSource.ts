import { join, relative } from "node:path";
import type { Node } from "typescript";

const rootDir: string = join(__dirname, "..", "..");

export function getSource(node: Node): string {
    const file = node.getSourceFile();

    const startPos = node.getStart();

    const { line, character } = file.getLineAndCharacterOfPosition(startPos);

    return `${relative(rootDir, file.fileName)}#${line + 1}:${character + 1}`;
}
