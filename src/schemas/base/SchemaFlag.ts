export enum SchemaFlag {
    /**
     * Removes this schema object from union representations.
     *
     * If all objects within a union have this flag, `null` should be returned.
     *
     * This is basically reserved for the `unknown` keyword.
     */
    RemovedInUnions,

    /**
     * Removes **all other** schema objects from union representations.
     *
     * If multiple objects within a union have this flag, the first one should be returned.
     *
     * This is basically reserved for the `any` keyword.
     */
    TakesOverUnions,

    /**
     * Signifies that a union between this schema object and another can be represented simply by
     * marking the other as `nullable`.
     */
    CanDoSimpleNullableUnions,
}
