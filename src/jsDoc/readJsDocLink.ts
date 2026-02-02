import { isIdentifier, type JSDocLink } from "typescript";
import { ParserError } from "@/errors/ParserError";

const urlRegExp: RegExp = new RegExp(/\s|\|/);

/** Converts a {@link JSDocLink} tag into text that can be shown in the API spec. */
export function readJsDocLink(node: JSDocLink): string {
    const { name, text } = node;

    if (name === undefined) {
        throw new ParserError(node, "JSDoc link tag must have a source");
    }

    if (!isIdentifier(name)) {
        throw new ParserError(node, "Source for JSDoc link tag must be an identifier");
    }

    if (name.escapedText === "https") {
        const split = `https${text}`.split(urlRegExp, 2);

        const url = split[0];

        if (!URL.canParse(url)) {
            throw new ParserError(node, `JSDoc link tag does not contain a valid link ("${url}")`);
        }

        const mask = split.at(1)?.trim();

        if (mask === undefined || mask.length === 0) {
            return url;
        }

        return `[${mask}](${url})`;
    }

    return `**${name.escapedText.toString().trim()}**`;
}
