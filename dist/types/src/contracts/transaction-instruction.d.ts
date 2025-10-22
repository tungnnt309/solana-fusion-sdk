import { Buffer } from 'buffer';
import { Address } from '../domains';
export declare class TransactionInstruction {
    /**
     * Program Id to execute
     */
    readonly programId: Address;
    readonly accounts: Array<AccountMeta>;
    /**
     * Program input
     */
    readonly data: Buffer;
    constructor(
    /**
     * Program Id to execute
     */
    programId: Address, accounts: Array<AccountMeta>, 
    /**
     * Program input
     */
    data: Buffer);
}
export type AccountMeta = {
    /** An account's public key */
    pubkey: Address;
    /** True if an instruction requires a transaction signature matching `pubkey` */
    isSigner: boolean;
    /** True if the `pubkey` can be loaded as a read-write account. */
    isWritable: boolean;
};
