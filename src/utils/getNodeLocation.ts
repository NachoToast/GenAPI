import { join, relative } from "node:path";
import type { Node } from "typescript";

const rootDir: string = join(__dirname, "..", "..");

/** Returns the file name, line number, and character position of the given {@link node}. */
export function getNodeLocation(node: Node): string {
    const file = node.getSourceFile();

    const startPos = node.getStart();

    const { line, character } = file.getLineAndCharacterOfPosition(startPos);

    return `${relative(rootDir, file.fileName)}#${line + 1}:${character + 1}`;
    // return `${file.fileName}#${line + 1}:${character + 1}`;
}
