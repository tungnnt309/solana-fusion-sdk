export type AddressLike = {
    toBuffer(): Buffer;
};
export declare class Address implements AddressLike {
    static ASSOCIATED_TOKE_PROGRAM_ID: Address;
    static TOKEN_PROGRAM_ID: Address;
    static TOKEN_2022_PROGRAM_ID: Address;
    static SYSTEM_PROGRAM_ID: Address;
    static readonly WRAPPED_NATIVE: Address;
    static readonly NATIVE: Address;
    private readonly buf;
    constructor(value: string);
    static fromUnknown(val: unknown): Address;
    static unique(): Address;
    static fromPublicKey(publicKey: AddressLike): Address;
    static fromBuffer(buf: Buffer | Uint8Array): Address;
    static fromBigInt(val: bigint): Address;
    toString(): string;
    toJSON(): string;
    toBuffer(): Buffer;
    equal(other: Address): boolean;
    isNative(): boolean;
}
