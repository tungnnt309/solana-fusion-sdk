import { PublicKey } from '@solana/web3.js';
import { Address } from '../../domains';
const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
/**
 * Return the associated token account for given params
 *
 * @param walletAddress
 * @param tokenMintAddress
 * @param tokenProgramId
 */
export function getAta(walletAddress, tokenMintAddress, tokenProgramId) {
    return Address.fromBuffer(PublicKey.findProgramAddressSync([
        walletAddress.toBuffer(),
        tokenProgramId.toBuffer(),
        tokenMintAddress.toBuffer()
    ], SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID)[0].toBuffer());
}
//# sourceMappingURL=ata.js.map