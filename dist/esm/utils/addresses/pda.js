import { PublicKey } from '@solana/web3.js';
import { Address } from '../../domains';
export function getPda(programId, seeds) {
    return Address.fromBuffer(PublicKey.findProgramAddressSync(seeds, new PublicKey(programId.toBuffer()))[0].toBuffer());
}
//# sourceMappingURL=pda.js.map