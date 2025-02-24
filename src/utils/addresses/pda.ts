import {PublicKey} from '@solana/web3.js'
import {Address, AddressLike} from '../../domains'

export function getPda(programId: AddressLike, seeds: Uint8Array[]): Address {
    return Address.fromBuffer(
        PublicKey.findProgramAddressSync(
            seeds,
            new PublicKey(programId.toBuffer())
        )[0].toBuffer()
    )
}
