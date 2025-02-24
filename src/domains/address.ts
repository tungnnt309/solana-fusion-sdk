import bs58 from 'bs58'
import {hexToUint8Array} from '@1inch/byte-utils'
import {PublicKey} from '@solana/web3.js'

export type AddressLike = {
    toBuffer(): Buffer
}

export class Address implements AddressLike {
    public static ASSOCIATED_TOKE_PROGRAM_ID = new Address(
        'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
    )

    public static TOKEN_PROGRAM_ID = new Address(
        'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
    )

    public static TOKEN_2020_PROGRAM_ID = new Address(
        'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
    )

    public static SYSTEM_PROGRAM_ID = new Address(
        '11111111111111111111111111111111'
    )

    public static readonly WRAPPED_NATIVE = new Address(
        'So11111111111111111111111111111111111111112'
    )

    constructor(public readonly value: string) {
        try {
            const decoded = bs58.decode(value)

            if (decoded.length !== 32) {
                throw ''
            }
        } catch {
            throw new Error(`${value} is not a valid address.`)
        }
    }

    static unique(): Address {
        return Address.fromPublicKey(PublicKey.unique())
    }

    static fromPublicKey(publicKey: AddressLike): Address {
        return Address.fromBuffer(publicKey.toBuffer())
    }

    static fromBuffer(buf: Buffer | Uint8Array): Address {
        return new Address(bs58.encode(buf))
    }

    static fromBigInt(val: bigint): Address {
        const buffer = hexToUint8Array(
            '0x' + val.toString(16).padStart(64, '0')
        )

        return Address.fromBuffer(buffer)
    }

    public toBuffer(): Buffer {
        return Buffer.from(bs58.decode(this.value))
    }
}
