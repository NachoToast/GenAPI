import { isIdentifier, type Node, type TypeChecker, type TypeReferenceNode } from "typescript";
import { ParserError } from "@/errors/ParserError";

/** Returns the underlying referenced node from a type reference. */
export function getReferencedType(node: TypeReferenceNode, typeChecker: TypeChecker): Node {
    const type = typeChecker.getTypeFromTypeNode(node);

    // getSymbol() only works for interface references
    let symbol = type.getSymbol();

    if (symbol === undefined && isIdentifier(node.typeName)) {
        // getSymbolAtLocation() only works for type references
        symbol = typeChecker.getSymbolAtLocation(node.typeName);
    }

    if (symbol === undefined) {
        throw new ParserError(node, "Encountered a TypeReferenceNode with no symbol");
    }

    const firstDeclaration = symbol.declarations?.at(0);

    if (firstDeclaration === undefined) {
        throw new ParserError(
            node,
            `Type reference node (symbol ${symbol.getName()}) has no declarations`,
        );
    }

    return firstDeclaration;
}
