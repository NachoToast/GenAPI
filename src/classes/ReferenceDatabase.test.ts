import { describe, expect, test } from "bun:test";
import { ParserError } from "@/errors/ParserError";
import { AliasedStringKeywordSchema } from "@/schemas/string/AliasedStringKeywordSchema";
import { createDefaultTestNode } from "@/tests/createDefaultTestNode";
import { ReferenceDatabase } from "./ReferenceDatabase";

describe(ReferenceDatabase.name, () => {
    const node = createDefaultTestNode();

    describe(ReferenceDatabase.prototype.tryReference.name, () => {
        test("returns null for nodes that do not exist in the database", () => {
            expect(new ReferenceDatabase().tryReference(node)).toBeNull();
        });

        test("returns the corresponding schema for nodes that do exist in the database", () => {
            const db = new ReferenceDatabase();

            const schema = new AliasedStringKeywordSchema(node, db);

            expect(db.tryReference(node)).toBe(schema);
        });

        test("increments the corresponding schema reference count", () => {
            const db = new ReferenceDatabase();

            const nodeA = createDefaultTestNode();
            const nodeB = createDefaultTestNode();
            const nodeC = createDefaultTestNode();

            const schemaA = new AliasedStringKeywordSchema(nodeA, db);
            const schemaB = new AliasedStringKeywordSchema(nodeB, db);
            const schemaC = new AliasedStringKeywordSchema(nodeC, db);

            expect(schemaA.referenceCount).toBe(1);
            expect(schemaB.referenceCount).toBe(1);
            expect(schemaC.referenceCount).toBe(1);

            db.tryReference(nodeB);

            expect(schemaA.referenceCount).toBe(1);
            expect(schemaB.referenceCount).toBe(2);
            expect(schemaC.referenceCount).toBe(1);
        });
    });

    describe(ReferenceDatabase.prototype.addReference.name, () => {
        test("stores non-duplicate schemas in the database", () => {
            const db = new ReferenceDatabase();

            const schema = new AliasedStringKeywordSchema(node, db);

            expect(db["values"].has(schema)).toBeTrue();
        });

        test("throws a ParserError when called with an already-added schema", () => {
            const db = new ReferenceDatabase();

            const schema = new AliasedStringKeywordSchema(node, db);

            expect(() => db.addReference(schema)).toThrowError(ParserError);
        });
    });

    describe(ReferenceDatabase.prototype.clearSingles.name, () => {
        test("removes schemas with < 2 references from the database", () => {
            const db = new ReferenceDatabase();

            const schema = new AliasedStringKeywordSchema(node, db);

            db.clearSingles();

            expect(db["values"].has(schema)).toBeFalse();
        });

        test("keeps schemas with >= 2 references in the database", () => {
            const db = new ReferenceDatabase();

            const schema = new AliasedStringKeywordSchema(node, db);

            db.tryReference(node);

            db.clearSingles();

            expect(db["values"].has(schema)).toBeTrue();
        });
    });

    describe(ReferenceDatabase.prototype.useReference.name, () => {
        test("returns null for schemas that do not exist in the database", () => {
            const db = new ReferenceDatabase();

            const schema = new AliasedStringKeywordSchema(node, db);

            expect(new ReferenceDatabase().useReference(schema)).toBeNull();
        });

        test("throws a ParserError if all references are used for the given schema", () => {
            const db = new ReferenceDatabase();

            const schema = new AliasedStringKeywordSchema(node, db);

            db.useReference(schema);

            expect(() => db.useReference(schema)).toThrowError(ParserError);
        });

        test("creates a $ref object for schemas with usable references", () => {
            const db = new ReferenceDatabase();

            const schema = new AliasedStringKeywordSchema(node, db);

            db.tryReference(node);

            expect(db.useReference(schema)).toMatchObject({ $ref: expect.any(String) });
        });
    });

    describe(ReferenceDatabase.prototype.getAll.name, () => {
        test("returns a record containing all the schemas in the database", () => {
            const db = new ReferenceDatabase();

            const schema1 = new AliasedStringKeywordSchema(node, db);
            const schema2 = new AliasedStringKeywordSchema(node, db);

            expect(db.getAll()).toMatchObject({
                [schema1.getFullName()]: schema1.toSchema(),
                [schema2.getFullName()]: schema2.toSchema(),
            });
        });
    });

    describe(ReferenceDatabase.prototype.toStringFull.name, () => {
        test("returns a string containing every schema in the database", () => {
            const db = new ReferenceDatabase();

            const schema1 = new AliasedStringKeywordSchema(node, db);
            const schema2 = new AliasedStringKeywordSchema(node, db);

            const result = db.toStringFull();

            expect(result).toInclude(schema1.toStringShort());
            expect(result).toInclude(schema2.toStringShort());
        });
    });
});
