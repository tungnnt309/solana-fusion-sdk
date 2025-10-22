"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FusionSwapContract = void 0;
const tslib_1 = require("tslib");
const anchor_1 = require("@coral-xyz/anchor");
const assert_1 = tslib_1.__importDefault(require("assert"));
const transaction_instruction_1 = require("./transaction-instruction");
const whitelist_contract_1 = require("./whitelist-contract");
const ata_1 = require("../utils/addresses/ata");
const domains_1 = require("../domains");
const fusion_swap_1 = require("../idl/fusion-swap");
const pda_1 = require("../utils/addresses/pda");
class FusionSwapContract {
    programId;
    static ADDRESS = new domains_1.Address('HNarfxC3kYMMhFkxUFeYb8wHVdPzY5t9pupqW5fL2meM');
    coder = new anchor_1.BorshCoder(fusion_swap_1.IDL);
    OPTIONAL_ACCOUNT_META;
    constructor(programId) {
        this.programId = programId;
        this.OPTIONAL_ACCOUNT_META = {
            pubkey: this.programId,
            isWritable: false,
            isSigner: false
        };
    }
    static default() {
        return new FusionSwapContract(FusionSwapContract.ADDRESS);
    }
    create(order, accounts) {
        const escrow = (0, pda_1.getPda)(this.programId, [
            new TextEncoder().encode('escrow'),
            accounts.maker.toBuffer(),
            order.getOrderHash()
        ]);
        return new transaction_instruction_1.TransactionInstruction(this.programId, [
            {
                // 0. system_program
                pubkey: domains_1.Address.SYSTEM_PROGRAM_ID,
                isWritable: false,
                isSigner: false
            },
            {
                // 1. escrow
                pubkey: escrow,
                isWritable: false,
                isSigner: false
            },
            {
                // 2. src_mint
                pubkey: order.srcMint,
                isWritable: false,
                isSigner: false
            },
            {
                // 3. src_token_program
                pubkey: accounts.srcTokenProgram,
                isWritable: false,
                isSigner: false
            },
            {
                // 4. escrow_src_ata
                pubkey: (0, ata_1.getAta)(escrow, order.srcMint, accounts.srcTokenProgram),
                isWritable: true,
                isSigner: false
            },
            {
                // 5. maker
                pubkey: accounts.maker,
                isSigner: true,
                isWritable: true
            },
            // 6. maker_src_ata
            order.srcAssetIsNative
                ? this.OPTIONAL_ACCOUNT_META
                : {
                    pubkey: (0, ata_1.getAta)(accounts.maker, order.srcMint, accounts.srcTokenProgram),
                    isWritable: true,
                    isSigner: false
                },
            {
                // 7. dst_mint
                pubkey: order.dstMint,
                isWritable: false,
                isSigner: false
            },
            {
                // 8. maker_receiver
                pubkey: order.receiver,
                isWritable: true,
                isSigner: false
            },
            {
                // 9. associated_token_program
                pubkey: domains_1.Address.ASSOCIATED_TOKE_PROGRAM_ID,
                isWritable: false,
                isSigner: false
            },
            {
                // 10. protocol_dst_ata
                pubkey: this.optional(order.fees?.protocolDstAta),
                isWritable: false,
                isSigner: false
            },
            {
                // 11. integrator_dst_ata
                pubkey: this.optional(order.fees?.integratorDstAta),
                isWritable: false,
                isSigner: false
            }
        ], this.coder.instruction.encode('create', {
            order: order.build()
        }));
    }
    fill(order, amount, accounts) {
        const whitelist = accounts.whitelist || whitelist_contract_1.WhitelistContract.ADDRESS;
        const escrow = (0, pda_1.getPda)(this.programId, [
            new TextEncoder().encode('escrow'),
            accounts.maker.toBuffer(),
            order.getOrderHash()
        ]);
        return new transaction_instruction_1.TransactionInstruction(this.programId, [
            {
                // 0. taker
                pubkey: accounts.taker,
                isSigner: true,
                isWritable: true
            },
            {
                // 1. resolver_access
                pubkey: (0, pda_1.getPda)(whitelist, [
                    new TextEncoder().encode('resolver_access'),
                    accounts.taker.toBuffer()
                ]),
                isWritable: false,
                isSigner: false
            },
            {
                // 2. maker
                pubkey: accounts.maker,
                isSigner: false,
                isWritable: true // in the case of dst is native
            },
            {
                // 3. maker_receiver
                pubkey: order.receiver,
                isSigner: false,
                isWritable: order.dstAssetIsNative ||
                    !accounts.maker.equal(order.receiver)
            },
            {
                // 4. src_mint
                pubkey: order.srcMint,
                isWritable: false,
                isSigner: false
            },
            {
                // 5. dst_mint
                pubkey: order.dstMint,
                isWritable: false,
                isSigner: false
            },
            {
                // 6. escrow
                pubkey: escrow,
                isWritable: false,
                isSigner: false
            },
            {
                // 7. escrow_src_ata
                pubkey: (0, ata_1.getAta)(escrow, order.srcMint, accounts.srcTokenProgram),
                isWritable: true,
                isSigner: false
            },
            {
                // 8. taker_src_ata
                pubkey: accounts.takerSrcAccount ??
                    (0, ata_1.getAta)(accounts.taker, order.srcMint, accounts.srcTokenProgram),
                isWritable: true,
                isSigner: false
            },
            {
                // 9. src_token_program
                pubkey: accounts.srcTokenProgram,
                isWritable: false,
                isSigner: false
            },
            {
                // 10. dst_token_program
                pubkey: accounts.dstTokenProgram,
                isWritable: false,
                isSigner: false
            },
            {
                // 11. system_program
                pubkey: domains_1.Address.SYSTEM_PROGRAM_ID,
                isWritable: false,
                isSigner: false
            },
            {
                // 12. associated_token_program
                pubkey: domains_1.Address.ASSOCIATED_TOKE_PROGRAM_ID,
                isWritable: false,
                isSigner: false
            },
            // 13. maker_dst_ata
            order.dstAssetIsNative
                ? this.OPTIONAL_ACCOUNT_META
                : {
                    pubkey: (0, ata_1.getAta)(order.receiver, order.dstMint, accounts.dstTokenProgram),
                    isWritable: true,
                    isSigner: false
                },
            // 14. taker_dst_ata
            order.dstAssetIsNative
                ? this.OPTIONAL_ACCOUNT_META
                : {
                    pubkey: (0, ata_1.getAta)(accounts.taker, order.dstMint, accounts.dstTokenProgram),
                    isWritable: true,
                    isSigner: false
                },
            // 15. protocol_dst_ata
            order.dstAssetIsNative || !order.fees?.protocolDstAta
                ? this.OPTIONAL_ACCOUNT_META
                : {
                    pubkey: order.fees.protocolDstAta,
                    isWritable: true,
                    isSigner: false
                },
            // 16. integrator_dst_ata
            order.dstAssetIsNative || !order.fees?.integratorDstAta
                ? this.OPTIONAL_ACCOUNT_META
                : {
                    pubkey: order.fees.integratorDstAta,
                    isWritable: true,
                    isSigner: false
                }
        ], this.coder.instruction.encode('fill', {
            order: order.build(),
            amount: new anchor_1.BN(amount.toString())
        }));
    }
    /**
     * Returns cancel instruction which only maker can submit
     */
    cancelOwnOrder(order, accounts) {
        const orderHash = order.getOrderHash();
        const escrow = (0, pda_1.getPda)(this.programId, [
            new TextEncoder().encode('escrow'),
            accounts.maker.toBuffer(),
            orderHash
        ]);
        return new transaction_instruction_1.TransactionInstruction(this.programId, [
            {
                // 1. maker
                pubkey: accounts.maker,
                isSigner: true,
                isWritable: true
            },
            {
                // 2. src_mint
                pubkey: order.srcMint,
                isWritable: false,
                isSigner: false
            },
            {
                // 3. escrow
                pubkey: escrow,
                isWritable: false,
                isSigner: false
            },
            {
                // 4. escrow_src_ata
                pubkey: (0, ata_1.getAta)(escrow, order.srcMint, accounts.srcTokenProgram),
                isWritable: true,
                isSigner: false
            },
            // 5. maker_src_ata
            order.srcAssetIsNative
                ? this.OPTIONAL_ACCOUNT_META
                : {
                    pubkey: (0, ata_1.getAta)(accounts.maker, order.srcMint, accounts.srcTokenProgram),
                    isWritable: true,
                    isSigner: false
                },
            {
                // 6. src_token_program
                pubkey: accounts.srcTokenProgram,
                isWritable: false,
                isSigner: false
            }
        ], this.coder.instruction.encode('cancel', {
            orderHash,
            orderSrcAssetIsNative: order.srcAssetIsNative
        }));
    }
    /**
     * Returns cancel instruction which only resolver with access token can submit
     */
    cancelOrderByResolver(order, accounts, 
    /**
     * If resolver wants to limit reward, he can pass here max reward in lamports
     */
    rewardLimit = order.resolverCancellationConfig?.maxCancellationPremium) {
        (0, assert_1.default)(order.resolverCancellationConfig, 'order can not be cancelled by resolver');
        (0, assert_1.default)(rewardLimit != undefined);
        const textEncoder = new TextEncoder();
        const whitelist = accounts.whitelist || whitelist_contract_1.WhitelistContract.ADDRESS;
        const orderHash = order.getOrderHash();
        const escrow = (0, pda_1.getPda)(this.programId, [
            textEncoder.encode('escrow'),
            accounts.maker.toBuffer(),
            orderHash
        ]);
        return new transaction_instruction_1.TransactionInstruction(this.programId, [
            {
                // 1. resolver
                pubkey: accounts.resolver,
                isSigner: true,
                isWritable: true
            },
            {
                // 2. resolver_access
                pubkey: (0, pda_1.getPda)(whitelist, [
                    textEncoder.encode('resolver_access'),
                    accounts.resolver.toBuffer()
                ]),
                isWritable: false,
                isSigner: false
            },
            {
                // 3. maker
                pubkey: accounts.maker,
                isWritable: true,
                isSigner: false
            },
            {
                // 4. maker_receiver
                pubkey: order.receiver,
                isWritable: order.srcAssetIsNative,
                isSigner: false
            },
            {
                // 5. src_mint
                pubkey: order.srcMint,
                isWritable: false,
                isSigner: false
            },
            {
                // 6. dst_mint
                pubkey: order.dstMint,
                isWritable: false,
                isSigner: false
            },
            {
                // 7. escrow
                pubkey: escrow,
                isWritable: false,
                isSigner: false
            },
            {
                // 8. escrow_src_ata
                pubkey: (0, ata_1.getAta)(escrow, order.srcMint, accounts.srcTokenProgram),
                isWritable: true,
                isSigner: false
            },
            // 9. maker_src_ata
            order.srcAssetIsNative
                ? this.OPTIONAL_ACCOUNT_META
                : {
                    pubkey: (0, ata_1.getAta)(accounts.maker, order.srcMint, accounts.srcTokenProgram),
                    isWritable: true,
                    isSigner: false
                },
            {
                // 10. src token program
                pubkey: accounts.srcTokenProgram,
                isWritable: false,
                isSigner: false
            },
            {
                // 11. system_program
                pubkey: domains_1.Address.SYSTEM_PROGRAM_ID,
                isWritable: false,
                isSigner: false
            },
            // 12. protocol_dst_ata
            order.dstAssetIsNative || !order.fees?.protocolDstAta
                ? this.OPTIONAL_ACCOUNT_META
                : {
                    pubkey: order.fees.protocolDstAta,
                    isWritable: true,
                    isSigner: false
                },
            // 13. integrator_dst_ata
            order.dstAssetIsNative || !order.fees?.integratorDstAta
                ? this.OPTIONAL_ACCOUNT_META
                : {
                    pubkey: order.fees.integratorDstAta,
                    isWritable: true,
                    isSigner: false
                }
        ], this.coder.instruction.encode('cancelByResolver', {
            order: order.build(),
            rewardLimit: new anchor_1.BN(rewardLimit.toString())
        }));
    }
    optional(acc) {
        return acc ? acc : this.programId;
    }
}
exports.FusionSwapContract = FusionSwapContract;
//# sourceMappingURL=fusion-swap-contract.js.map