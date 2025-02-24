import {Buffer} from 'buffer'
import {Address} from '../domains'

export class TransactionInstruction {
    constructor(
        /**
         * Program Id to execute
         */
        public readonly programId: Address,
        public readonly accounts: Array<AccountMeta>,

        /**
         * Program input
         */
        public readonly data: Buffer
    ) {}
}

export type AccountMeta = {
    /** An account's public key */
    pubkey: Address
    /** True if an instruction requires a transaction signature matching `pubkey` */
    isSigner: boolean
    /** True if the `pubkey` can be loaded as a read-write account. */
    isWritable: boolean
}
