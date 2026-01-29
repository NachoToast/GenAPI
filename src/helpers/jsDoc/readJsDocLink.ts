import { isIdentifier, type JSDocLink } from "typescript";
import { ParserError } from "@/errors/ParserError";

const urlRegExp: RegExp = new RegExp(/\s/);

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
        if (text.at(0) !== ":") {
            throw new ParserError(node, `JSDoc link tag is not well formed ("${text}")`);
        }

        const [url, mask] = text.slice(1).split(urlRegExp);

        if (!URL.canParse(url)) {
            throw new ParserError(node, `JSDoc link tag does not contain a valid link ("${url}")`);
        }

        const finalMask = mask.trim();

        if (finalMask.length === 0) {
            return url;
        }

        return `[${mask}]${url}})`;
    }

    return `**${name.escapedText.toString().trim()}**`;
}

// TODO: tests
// {@link NumberAlias}
// name: Identifier("NumberAlias")
// text: ""

// {@link NumberAlias a number wow}
// name: Identifier("NumberAlias")
// text: "a number wow"

// {@link unresolved}
// name: Identifier("unresolved")
// text: ""

// {@link unresolved wow}
// name: Identifier("unresolved")
// text: "wow"

// {@link https://www.example.com}
// name: Identifier("https")
// text: "://www.example.com"

// {@link https://www.example.com example_dot_com}
// name: Identifier("https")
// text: "://www.example.com example_dot_com"
