"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionInstruction = void 0;
class TransactionInstruction {
    programId;
    accounts;
    data;
    constructor(
    /**
     * Program Id to execute
     */
    programId, accounts, 
    /**
     * Program input
     */
    data) {
        this.programId = programId;
        this.accounts = accounts;
        this.data = data;
    }
}
exports.TransactionInstruction = TransactionInstruction;
//# sourceMappingURL=transaction-instruction.js.map