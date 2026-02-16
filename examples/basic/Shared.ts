/**
 * Description for SharedInterfaceA.
 *
 * @see {@link https://example.com}
 */
export interface SharedInterfaceA {
    fieldA: string | null;

    fieldB?: 7;

    fieldC: string | number | null;
}

/**
 * Description for SharedInterfaceB, which is next to {@link SharedInterfaceA}.
 *
 * @see {@link https://example.com Link Mask}
 */
export interface SharedInterfaceB {
    fieldA: SharedInterfaceA;

    fieldB: boolean;

    fieldC: SomeEnum;

    fieldD: SharedInterfaceB;

    fieldE: SomeEnum;
}

/** Description for SomeEnum? */
enum SomeEnum {
    ValueOne = "v1",

    ValueTwo = "v2",

    /** wow */

    ValueThree = "v3",

    /** test */
    ValueFour = 5 << 2,
}

/** Exported but never used interface. */
export interface SharedButNeverUsedInterface {
    fieldA: never;
}
