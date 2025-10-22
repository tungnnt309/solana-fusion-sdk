export class TransactionInstruction {
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
//# sourceMappingURL=transaction-instruction.js.map