import {PublicKey} from '@solana/web3.js'
import {Address, AddressLike} from '../../domains'

const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: PublicKey = new PublicKey(
    'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
)

/**
 * Return the associated token account for given params
 *
 * @param walletAddress
 * @param tokenMintAddress
 * @param tokenProgramId
 */
export function getAta(
    walletAddress: AddressLike,
    tokenMintAddress: AddressLike,
    tokenProgramId: AddressLike
): Address {
    return Address.fromBuffer(
        PublicKey.findProgramAddressSync(
            [
                walletAddress.toBuffer(),
                tokenProgramId.toBuffer(),
                tokenMintAddress.toBuffer()
            ],
            SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
        )[0].toBuffer()
    )
}
