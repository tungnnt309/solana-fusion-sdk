"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FusionOrder = void 0;
const tslib_1 = require("tslib");
const anchor_1 = require("@coral-xyz/anchor");
const borsh = tslib_1.__importStar(require("borsh"));
const byte_utils_1 = require("@1inch/byte-utils");
const bs58_1 = tslib_1.__importDefault(require("bs58"));
const crypto = tslib_1.__importStar(require("crypto"));
const assert_1 = tslib_1.__importDefault(require("assert"));
const auction_details_1 = require("./auction-details");
const fee_config_1 = require("./fee-config");
const resolver_cancellation_config_1 = require("./resolver-cancellation-config");
const domains_1 = require("../domains");
const amount_calculator_1 = require("../amount-calculator");
const fee_calculator_1 = require("../amount-calculator/fee-calculator/fee-calculator");
const contracts_1 = require("../contracts");
const utils_1 = require("../utils/");
const fusion_swap_1 = require("../idl/fusion-swap");
class FusionOrder {
    static DefaultExtra = {
        orderExpirationDelay: 12,
        fees: fee_config_1.FeeConfig.ZERO,
        resolverCancellationConfig: resolver_cancellation_config_1.ResolverCancellationConfig.ALMOST_ZERO // to enable cancellation by resolver
    };
    orderConfig;
    constructor(orderInfo, auctionDetails, extra) {
        (0, assert_1.default)(!orderInfo.dstMint.equal(orderInfo.srcMint), 'tokens must be different');
        const orderExpirationDelay = extra.orderExpirationDelay ??
            FusionOrder.DefaultExtra.orderExpirationDelay;
        const deadline = auctionDetails.startTime +
            auctionDetails.duration +
            orderExpirationDelay;
        (0, utils_1.assertUInteger)(orderExpirationDelay);
        (0, utils_1.assertUInteger)(deadline);
        (0, utils_1.assertUInteger)(orderInfo.id);
        (0, utils_1.assertUInteger)(orderInfo.srcAmount, byte_utils_1.UINT_64_MAX);
        (0, utils_1.assertUInteger)(orderInfo.estimatedDstAmount, byte_utils_1.UINT_64_MAX);
        (0, utils_1.assertUInteger)(orderInfo.minDstAmount, byte_utils_1.UINT_64_MAX);
        const fees = extra.fees || FusionOrder.DefaultExtra.fees;
        const resolverCancellationConfig = extra.resolverCancellationConfig ||
            FusionOrder.DefaultExtra.resolverCancellationConfig;
        this.orderConfig = {
            ...orderInfo,
            dutchAuctionData: auctionDetails,
            fees,
            srcAssetIsNative: extra.srcAssetIsNative,
            dstAssetIsNative: extra.dstAssetIsNative,
            expirationTime: deadline,
            resolverCancellationConfig: resolverCancellationConfig
        };
    }
    get fees() {
        return this.orderConfig.fees.isZero() ? null : this.orderConfig.fees;
    }
    get resolverCancellationConfig() {
        return this.orderConfig.resolverCancellationConfig.isZero()
            ? null
            : this.orderConfig.resolverCancellationConfig;
    }
    get srcMint() {
        return this.orderConfig.srcMint;
    }
    get dstMint() {
        return this.orderConfig.dstMint;
    }
    get srcAmount() {
        return this.orderConfig.srcAmount;
    }
    get minDstAmount() {
        return this.orderConfig.minDstAmount;
    }
    get estimatedDstAmount() {
        return this.orderConfig.estimatedDstAmount;
    }
    /**
     * Receiver of funds
     */
    get receiver() {
        return this.orderConfig.receiver;
    }
    /**
     * Timestamp in sec
     */
    get deadline() {
        return this.orderConfig.expirationTime;
    }
    /**
     * Timestamp in sec
     */
    get auctionStartTime() {
        return this.orderConfig.dutchAuctionData.startTime;
    }
    /**
     * Timestamp in sec
     */
    get auctionEndTime() {
        const { startTime, duration } = this.orderConfig.dutchAuctionData;
        return startTime + duration;
    }
    get auctionDetails() {
        return this.orderConfig.dutchAuctionData;
    }
    get id() {
        return this.orderConfig.id;
    }
    get srcAssetIsNative() {
        return this.orderConfig.srcAssetIsNative;
    }
    get dstAssetIsNative() {
        return this.orderConfig.dstAssetIsNative;
    }
    static new(orderInfo, auctionDetails, extra = FusionOrder.DefaultExtra) {
        return new FusionOrder({
            ...orderInfo,
            srcMint: orderInfo.srcMint.isNative()
                ? domains_1.Address.WRAPPED_NATIVE
                : orderInfo.srcMint,
            dstMint: orderInfo.dstMint.isNative()
                ? domains_1.Address.WRAPPED_NATIVE
                : orderInfo.dstMint
        }, auctionDetails, {
            ...extra,
            srcAssetIsNative: orderInfo.srcMint.isNative(),
            dstAssetIsNative: orderInfo.dstMint.isNative()
        });
    }
    static fromCreateInstruction(ix) {
        const _ix = new anchor_1.BorshCoder(fusion_swap_1.IDL).instruction.decode(ix.data);
        if (!_ix || _ix.name !== 'create') {
            throw new Error('invalid instruction');
        }
        (0, assert_1.default)('order' in _ix.data);
        const reducedConfig = _ix.data.order;
        const srcMint = ix.accounts[2];
        const dstMint = ix.accounts[7];
        const receiverAcc = ix.accounts[8];
        const protocolDstAta = ix.accounts[10];
        const integratorDstAta = ix.accounts[11];
        (0, assert_1.default)(receiverAcc);
        (0, assert_1.default)(srcMint);
        (0, assert_1.default)(dstMint);
        (0, assert_1.default)(protocolDstAta);
        (0, assert_1.default)(integratorDstAta);
        return FusionOrder.fromContractOrder(reducedConfig, {
            srcMint: srcMint.pubkey,
            receiver: receiverAcc.pubkey,
            dstMint: dstMint.pubkey,
            integratorDstAta: integratorDstAta.pubkey,
            programId: ix.programId,
            protocolDstAta: protocolDstAta.pubkey
        });
    }
    static fromFillInstruction(ix) {
        const _ix = new anchor_1.BorshCoder(fusion_swap_1.IDL).instruction.decode(ix.data);
        if (!_ix || _ix.name !== 'fill') {
            throw new Error('invalid instruction');
        }
        (0, assert_1.default)('order' in _ix.data);
        const reducedConfig = _ix.data.order;
        const srcMint = ix.accounts[4];
        const dstMint = ix.accounts[5];
        const receiverAccMeta = ix.accounts[3];
        const protocolDstAta = ix.accounts[15];
        const integratorDstAta = ix.accounts[16];
        (0, assert_1.default)(receiverAccMeta);
        (0, assert_1.default)(srcMint);
        (0, assert_1.default)(dstMint);
        (0, assert_1.default)(protocolDstAta);
        (0, assert_1.default)(integratorDstAta);
        return FusionOrder.fromContractOrder(reducedConfig, {
            srcMint: srcMint.pubkey,
            receiver: receiverAccMeta.pubkey,
            dstMint: dstMint.pubkey,
            integratorDstAta: integratorDstAta.pubkey,
            programId: ix.programId,
            protocolDstAta: protocolDstAta.pubkey
        });
    }
    static fromResolverCancelInstruction(ix) {
        const _ix = new anchor_1.BorshCoder(fusion_swap_1.IDL).instruction.decode(ix.data);
        if (!_ix || _ix.name !== 'cancelByResolver') {
            throw new Error('invalid instruction');
        }
        (0, assert_1.default)('order' in _ix.data);
        const reducedConfig = _ix.data.order;
        const srcMint = ix.accounts[4];
        const dstMint = ix.accounts[5];
        const receiverAccMeta = ix.accounts[3];
        const protocolDstAta = ix.accounts[11];
        const integratorDstAta = ix.accounts[12];
        (0, assert_1.default)(receiverAccMeta);
        (0, assert_1.default)(srcMint);
        (0, assert_1.default)(dstMint);
        (0, assert_1.default)(protocolDstAta);
        (0, assert_1.default)(integratorDstAta);
        return FusionOrder.fromContractOrder(reducedConfig, {
            srcMint: srcMint.pubkey,
            receiver: receiverAccMeta.pubkey,
            dstMint: dstMint.pubkey,
            integratorDstAta: integratorDstAta.pubkey,
            programId: ix.programId,
            protocolDstAta: protocolDstAta.pubkey
        });
    }
    static fromContractOrder(reducedConfig, accounts) {
        const { srcMint, dstMint, receiver, protocolDstAta, integratorDstAta, programId } = accounts;
        const { dutchAuctionData: auction, fee } = reducedConfig;
        const orderExpirationDelay = reducedConfig.expirationTime - auction.duration - auction.startTime;
        const fees = new fee_config_1.FeeConfig(protocolDstAta.equal(programId) ? null : protocolDstAta, integratorDstAta.equal(programId) ? null : integratorDstAta, domains_1.Bps.fromFraction(fee.protocolFee, fee_config_1.FeeConfig.BASE_1E5), domains_1.Bps.fromFraction(fee.integratorFee, fee_config_1.FeeConfig.BASE_1E5), domains_1.Bps.fromFraction(fee.surplusPercentage, fee_config_1.FeeConfig.BASE_1E2));
        const resolverCancellationConfig = new resolver_cancellation_config_1.ResolverCancellationConfig(BigInt(reducedConfig.fee.maxCancellationPremium.toString()), reducedConfig.cancellationAuctionDuration);
        return new FusionOrder({
            srcMint: srcMint,
            dstMint: dstMint,
            id: reducedConfig.id,
            srcAmount: BigInt(reducedConfig.srcAmount.toString()),
            minDstAmount: BigInt(reducedConfig.minDstAmount.toString()),
            estimatedDstAmount: BigInt(reducedConfig.estimatedDstAmount.toString()),
            receiver
        }, new auction_details_1.AuctionDetails({
            startTime: auction.startTime,
            duration: auction.duration,
            initialRateBump: auction.initialRateBump,
            points: auction.pointsAndTimeDeltas.map((p) => ({
                coefficient: p.rateBump,
                delay: p.timeDelta
            }))
        }), {
            dstAssetIsNative: reducedConfig.dstAssetIsNative,
            srcAssetIsNative: reducedConfig.srcAssetIsNative,
            orderExpirationDelay,
            fees,
            resolverCancellationConfig
        });
    }
    static fromJSON(json) {
        const { dutchAuctionData: auction, fee } = json;
        const orderExpirationDelay = json.expirationTime - auction.duration - auction.startTime;
        const fees = new fee_config_1.FeeConfig(fee.protocolDstAta ? new domains_1.Address(fee.protocolDstAta) : null, fee.integratorDstAta ? new domains_1.Address(fee.integratorDstAta) : null, domains_1.Bps.fromFraction(fee.protocolFee, fee_config_1.FeeConfig.BASE_1E5), domains_1.Bps.fromFraction(fee.integratorFee, fee_config_1.FeeConfig.BASE_1E5), domains_1.Bps.fromFraction(fee.surplusPercentage, fee_config_1.FeeConfig.BASE_1E2));
        const resolverCancellationConfig = new resolver_cancellation_config_1.ResolverCancellationConfig(BigInt(fee.maxCancellationPremium.toString()), json.cancellationAuctionDuration);
        return new FusionOrder({
            srcMint: new domains_1.Address(json.srcMint),
            dstMint: new domains_1.Address(json.dstMint),
            id: json.id,
            srcAmount: BigInt(json.srcAmount),
            minDstAmount: BigInt(json.minDstAmount),
            estimatedDstAmount: BigInt(json.estimatedDstAmount),
            receiver: new domains_1.Address(json.receiver)
        }, new auction_details_1.AuctionDetails({
            startTime: auction.startTime,
            duration: auction.duration,
            initialRateBump: auction.initialRateBump,
            points: auction.pointsAndTimeDeltas.map((p) => ({
                coefficient: p.rateBump,
                delay: p.timeDelta
            }))
        }), {
            srcAssetIsNative: json.srcAssetIsNative,
            dstAssetIsNative: json.dstAssetIsNative,
            orderExpirationDelay,
            fees,
            resolverCancellationConfig
        });
    }
    build() {
        const { fees, dutchAuctionData: auction, resolverCancellationConfig } = this.orderConfig;
        return {
            id: this.orderConfig.id,
            srcAmount: new anchor_1.BN(this.orderConfig.srcAmount.toString()),
            minDstAmount: new anchor_1.BN(this.orderConfig.minDstAmount.toString()),
            estimatedDstAmount: new anchor_1.BN(this.orderConfig.estimatedDstAmount.toString()),
            expirationTime: this.orderConfig.expirationTime,
            srcAssetIsNative: this.orderConfig.srcAssetIsNative,
            dstAssetIsNative: this.orderConfig.dstAssetIsNative,
            fee: {
                protocolFee: fees.protocolFee.toFraction(fee_config_1.FeeConfig.BASE_1E5),
                integratorFee: fees.integratorFee.toFraction(fee_config_1.FeeConfig.BASE_1E5),
                surplusPercentage: fees.surplusShare.toFraction(fee_config_1.FeeConfig.BASE_1E2),
                maxCancellationPremium: new anchor_1.BN(resolverCancellationConfig.maxCancellationPremium.toString())
            },
            dutchAuctionData: {
                startTime: auction.startTime,
                duration: auction.duration,
                initialRateBump: auction.initialRateBump,
                pointsAndTimeDeltas: auction.points.map((p) => ({
                    rateBump: p.coefficient,
                    timeDelta: p.delay
                }))
            },
            cancellationAuctionDuration: resolverCancellationConfig.cancellationAuctionDuration
        };
    }
    toJSON() {
        const order = this.build();
        const { protocolDstAta, integratorDstAta } = this.orderConfig.fees;
        return {
            ...order,
            srcAmount: order.srcAmount.toString(),
            estimatedDstAmount: order.estimatedDstAmount.toString(),
            minDstAmount: order.minDstAmount.toString(),
            receiver: this.orderConfig.receiver.toString(),
            srcMint: this.orderConfig.srcMint.toString(),
            dstMint: this.orderConfig.dstMint.toString(),
            fee: {
                ...order.fee,
                protocolDstAta: protocolDstAta
                    ? protocolDstAta.toString()
                    : null,
                integratorDstAta: integratorDstAta
                    ? integratorDstAta.toString()
                    : null,
                maxCancellationPremium: order.fee.maxCancellationPremium.toString()
            }
        };
    }
    /**
     * Returns orderHash
     */
    getOrderHash() {
        return crypto
            .createHash('sha256')
            .update(borsh.serialize(OrderConfigSchema, this.build()))
            .update(borsh.serialize(OptionalAddressSchema, this.orderConfig.fees.protocolDstAta?.toBuffer()))
            .update(borsh.serialize(OptionalAddressSchema, this.orderConfig.fees.integratorDstAta?.toBuffer()))
            .update(borsh.serialize(AddressSchema, this.srcMint.toBuffer()))
            .update(borsh.serialize(AddressSchema, this.dstMint.toBuffer()))
            .update(borsh.serialize(AddressSchema, this.receiver.toBuffer()))
            .digest();
    }
    getOrderHashBase58() {
        return bs58_1.default.encode(this.getOrderHash());
    }
    /**
     * Returns escrow ata for src token
     */
    getEscrow(maker, 
    /**
     * Src token program id - TOKEN_PROGRAM_ID or TOKEN_2020_PROGRAM_ID
     */
    srcTokenProgram = domains_1.Address.TOKEN_PROGRAM_ID, 
    /**
     * FusionSwap program id
     */
    programId = contracts_1.FusionSwapContract.ADDRESS) {
        const escrow = (0, utils_1.getPda)(programId, [
            new TextEncoder().encode('escrow'),
            maker.toBuffer(),
            this.getOrderHash()
        ]);
        return (0, utils_1.getAta)(escrow, this.srcMint, srcTokenProgram);
    }
    /**
     * Calculates required taking amount to fill order for passed `makingAmount` at block time `time`
     *
     * @param makingAmount maker swap amount
     * @param time execution time in sec
     * */
    calcTakingAmount(makingAmount, time) {
        const takingAmount = amount_calculator_1.AmountCalculator.calcTakingAmount(makingAmount, this.srcAmount, this.minDstAmount);
        return this.getCalculator().getRequiredTakingAmount(takingAmount, time);
    }
    /**
     * How much user will receive in dst token
     *
     * @param makingAmount maker swap amount
     * @param time block time at which order will be filled
     */
    getUserReceiveAmount(makingAmount, time) {
        const takingAmount = amount_calculator_1.AmountCalculator.calcTakingAmount(makingAmount, this.srcAmount, this.minDstAmount);
        return this.getCalculator().getUserReceiveAmount(takingAmount, this.estimatedDstAmount, time);
    }
    /**
     * Fee in `dstToken` which integrator gets to integrator ata account
     *
     * @param makingAmount maker swap amount
     * @param time block time at which order will be filled
     */
    getIntegratorFee(time, makingAmount = this.srcAmount) {
        const takingAmount = amount_calculator_1.AmountCalculator.calcTakingAmount(makingAmount, this.srcAmount, this.minDstAmount);
        return this.getCalculator().getIntegratorFee(takingAmount, time) ?? 0n;
    }
    /**
     * Fee in `dstToken` which protocol gets to ata account
     *
     * @param makingAmount maker swap amount
     * @param time block time at which order will be filled
     */
    getProtocolFee(time, makingAmount = this.srcAmount) {
        const takingAmount = amount_calculator_1.AmountCalculator.calcTakingAmount(makingAmount, this.srcAmount, this.minDstAmount);
        return (this.getCalculator().getProtocolFee(takingAmount, this.estimatedDstAmount, time) ?? 0n);
    }
    /**
     * Check is order expired at a given time
     *
     * @param time timestamp in seconds
     */
    isExpiredAt(time) {
        return time > this.deadline;
    }
    getCalculator() {
        return new amount_calculator_1.AmountCalculator(amount_calculator_1.AuctionCalculator.fromAuctionData(this.orderConfig.dutchAuctionData), fee_calculator_1.FeeCalculator.fromFeeConfig(this.orderConfig.fees));
    }
}
exports.FusionOrder = FusionOrder;
const OrderConfigSchema = {
    struct: {
        id: 'u32',
        srcAmount: 'u64',
        minDstAmount: 'u64',
        estimatedDstAmount: 'u64',
        expirationTime: 'u32',
        srcAssetIsNative: 'bool',
        dstAssetIsNative: 'bool',
        fee: {
            struct: {
                protocolFee: 'u16',
                integratorFee: 'u16',
                surplusPercentage: 'u8',
                maxCancellationPremium: 'u64'
            }
        },
        dutchAuctionData: {
            struct: {
                startTime: 'u32',
                duration: 'u32',
                initialRateBump: 'u16',
                pointsAndTimeDeltas: {
                    array: {
                        type: {
                            struct: {
                                rateBump: 'u16',
                                timeDelta: 'u16'
                            }
                        }
                    }
                }
            }
        },
        cancellationAuctionDuration: 'u32'
    }
};
const AddressSchema = { array: { type: 'u8', len: 32 } };
const OptionalAddressSchema = { option: { array: { type: 'u8', len: 32 } } };
//# sourceMappingURL=fusion-order.js.map