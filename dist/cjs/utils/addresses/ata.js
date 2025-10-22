"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAta = getAta;
const web3_js_1 = require("@solana/web3.js");
const domains_1 = require("../../domains");
const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new web3_js_1.PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
/**
 * Return the associated token account for given params
 *
 * @param walletAddress
 * @param tokenMintAddress
 * @param tokenProgramId
 */
function getAta(walletAddress, tokenMintAddress, tokenProgramId) {
    return domains_1.Address.fromBuffer(web3_js_1.PublicKey.findProgramAddressSync([
        walletAddress.toBuffer(),
        tokenProgramId.toBuffer(),
        tokenMintAddress.toBuffer()
    ], SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID)[0].toBuffer());
}
//# sourceMappingURL=ata.js.map