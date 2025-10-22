"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPda = getPda;
const web3_js_1 = require("@solana/web3.js");
const domains_1 = require("../../domains");
function getPda(programId, seeds) {
    return domains_1.Address.fromBuffer(web3_js_1.PublicKey.findProgramAddressSync(seeds, new web3_js_1.PublicKey(programId.toBuffer()))[0].toBuffer());
}
//# sourceMappingURL=pda.js.map