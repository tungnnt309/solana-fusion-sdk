import bs58 from 'bs58'
import {hexToUint8Array} from '@1inch/byte-utils'

export type AddressLike = {
    toBuffer(): Buffer
}

export class Address implements AddressLike {
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
