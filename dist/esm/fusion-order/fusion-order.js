import { BN, BorshCoder } from '@coral-xyz/anchor';
import * as borsh from 'borsh';
import { UINT_64_MAX } from '@1inch/byte-utils';
import bs58 from 'bs58';
import * as crypto from 'crypto';
import assert from 'assert';
import { AuctionDetails } from './auction-details';
import { FeeConfig } from './fee-config';
import { ResolverCancellationConfig } from './resolver-cancellation-config';
import { Address, Bps } from '../domains';
import { AmountCalculator, AuctionCalculator } from '../amount-calculator';
import { FeeCalculator } from '../amount-calculator/fee-calculator/fee-calculator';
import { FusionSwapContract } from '../contracts';
import { getPda, getAta, assertUInteger } from '../utils/';
import { IDL } from '../idl/fusion-swap';
export class FusionOrder {
    static DefaultExtra = {
        orderExpirationDelay: 12,
        fees: FeeConfig.ZERO,
        resolverCancellationConfig: ResolverCancellationConfig.ALMOST_ZERO // to enable cancellation by resolver
    };
    orderConfig;
    constructor(orderInfo, auctionDetails, extra) {
        assert(!orderInfo.dstMint.equal(orderInfo.srcMint), 'tokens must be different');
        const orderExpirationDelay = extra.orderExpirationDelay ??
            FusionOrder.DefaultExtra.orderExpirationDelay;
        const deadline = auctionDetails.startTime +
            auctionDetails.duration +
            orderExpirationDelay;
        assertUInteger(orderExpirationDelay);
        assertUInteger(deadline);
        assertUInteger(orderInfo.id);
        assertUInteger(orderInfo.srcAmount, UINT_64_MAX);
        assertUInteger(orderInfo.estimatedDstAmount, UINT_64_MAX);
        assertUInteger(orderInfo.minDstAmount, UINT_64_MAX);
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
                ? Address.WRAPPED_NATIVE
                : orderInfo.srcMint,
            dstMint: orderInfo.dstMint.isNative()
                ? Address.WRAPPED_NATIVE
                : orderInfo.dstMint
        }, auctionDetails, {
            ...extra,
            srcAssetIsNative: orderInfo.srcMint.isNative(),
            dstAssetIsNative: orderInfo.dstMint.isNative()
        });
    }
    static fromCreateInstruction(ix) {
        const _ix = new BorshCoder(IDL).instruction.decode(ix.data);
        if (!_ix || _ix.name !== 'create') {
            throw new Error('invalid instruction');
        }
        assert('order' in _ix.data);
        const reducedConfig = _ix.data.order;
        const srcMint = ix.accounts[2];
        const dstMint = ix.accounts[7];
        const receiverAcc = ix.accounts[8];
        const protocolDstAta = ix.accounts[10];
        const integratorDstAta = ix.accounts[11];
        assert(receiverAcc);
        assert(srcMint);
        assert(dstMint);
        assert(protocolDstAta);
        assert(integratorDstAta);
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
        const _ix = new BorshCoder(IDL).instruction.decode(ix.data);
        if (!_ix || _ix.name !== 'fill') {
            throw new Error('invalid instruction');
        }
        assert('order' in _ix.data);
        const reducedConfig = _ix.data.order;
        const srcMint = ix.accounts[4];
        const dstMint = ix.accounts[5];
        const receiverAccMeta = ix.accounts[3];
        const protocolDstAta = ix.accounts[15];
        const integratorDstAta = ix.accounts[16];
        assert(receiverAccMeta);
        assert(srcMint);
        assert(dstMint);
        assert(protocolDstAta);
        assert(integratorDstAta);
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
        const _ix = new BorshCoder(IDL).instruction.decode(ix.data);
        if (!_ix || _ix.name !== 'cancelByResolver') {
            throw new Error('invalid instruction');
        }
        assert('order' in _ix.data);
        const reducedConfig = _ix.data.order;
        const srcMint = ix.accounts[4];
        const dstMint = ix.accounts[5];
        const receiverAccMeta = ix.accounts[3];
        const protocolDstAta = ix.accounts[11];
        const integratorDstAta = ix.accounts[12];
        assert(receiverAccMeta);
        assert(srcMint);
        assert(dstMint);
        assert(protocolDstAta);
        assert(integratorDstAta);
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
        const fees = new FeeConfig(protocolDstAta.equal(programId) ? null : protocolDstAta, integratorDstAta.equal(programId) ? null : integratorDstAta, Bps.fromFraction(fee.protocolFee, FeeConfig.BASE_1E5), Bps.fromFraction(fee.integratorFee, FeeConfig.BASE_1E5), Bps.fromFraction(fee.surplusPercentage, FeeConfig.BASE_1E2));
        const resolverCancellationConfig = new ResolverCancellationConfig(BigInt(reducedConfig.fee.maxCancellationPremium.toString()), reducedConfig.cancellationAuctionDuration);
        return new FusionOrder({
            srcMint: srcMint,
            dstMint: dstMint,
            id: reducedConfig.id,
            srcAmount: BigInt(reducedConfig.srcAmount.toString()),
            minDstAmount: BigInt(reducedConfig.minDstAmount.toString()),
            estimatedDstAmount: BigInt(reducedConfig.estimatedDstAmount.toString()),
            receiver
        }, new AuctionDetails({
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
        const fees = new FeeConfig(fee.protocolDstAta ? new Address(fee.protocolDstAta) : null, fee.integratorDstAta ? new Address(fee.integratorDstAta) : null, Bps.fromFraction(fee.protocolFee, FeeConfig.BASE_1E5), Bps.fromFraction(fee.integratorFee, FeeConfig.BASE_1E5), Bps.fromFraction(fee.surplusPercentage, FeeConfig.BASE_1E2));
        const resolverCancellationConfig = new ResolverCancellationConfig(BigInt(fee.maxCancellationPremium.toString()), json.cancellationAuctionDuration);
        return new FusionOrder({
            srcMint: new Address(json.srcMint),
            dstMint: new Address(json.dstMint),
            id: json.id,
            srcAmount: BigInt(json.srcAmount),
            minDstAmount: BigInt(json.minDstAmount),
            estimatedDstAmount: BigInt(json.estimatedDstAmount),
            receiver: new Address(json.receiver)
        }, new AuctionDetails({
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
            srcAmount: new BN(this.orderConfig.srcAmount.toString()),
            minDstAmount: new BN(this.orderConfig.minDstAmount.toString()),
            estimatedDstAmount: new BN(this.orderConfig.estimatedDstAmount.toString()),
            expirationTime: this.orderConfig.expirationTime,
            srcAssetIsNative: this.orderConfig.srcAssetIsNative,
            dstAssetIsNative: this.orderConfig.dstAssetIsNative,
            fee: {
                protocolFee: fees.protocolFee.toFraction(FeeConfig.BASE_1E5),
                integratorFee: fees.integratorFee.toFraction(FeeConfig.BASE_1E5),
                surplusPercentage: fees.surplusShare.toFraction(FeeConfig.BASE_1E2),
                maxCancellationPremium: new BN(resolverCancellationConfig.maxCancellationPremium.toString())
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
        return bs58.encode(this.getOrderHash());
    }
    /**
     * Returns escrow ata for src token
     */
    getEscrow(maker, 
    /**
     * Src token program id - TOKEN_PROGRAM_ID or TOKEN_2020_PROGRAM_ID
     */
    srcTokenProgram = Address.TOKEN_PROGRAM_ID, 
    /**
     * FusionSwap program id
     */
    programId = FusionSwapContract.ADDRESS) {
        const escrow = getPda(programId, [
            new TextEncoder().encode('escrow'),
            maker.toBuffer(),
            this.getOrderHash()
        ]);
        return getAta(escrow, this.srcMint, srcTokenProgram);
    }
    /**
     * Calculates required taking amount to fill order for passed `makingAmount` at block time `time`
     *
     * @param makingAmount maker swap amount
     * @param time execution time in sec
     * */
    calcTakingAmount(makingAmount, time) {
        const takingAmount = AmountCalculator.calcTakingAmount(makingAmount, this.srcAmount, this.minDstAmount);
        return this.getCalculator().getRequiredTakingAmount(takingAmount, time);
    }
    /**
     * How much user will receive in dst token
     *
     * @param makingAmount maker swap amount
     * @param time block time at which order will be filled
     */
    getUserReceiveAmount(makingAmount, time) {
        const takingAmount = AmountCalculator.calcTakingAmount(makingAmount, this.srcAmount, this.minDstAmount);
        return this.getCalculator().getUserReceiveAmount(takingAmount, this.estimatedDstAmount, time);
    }
    /**
     * Fee in `dstToken` which integrator gets to integrator ata account
     *
     * @param makingAmount maker swap amount
     * @param time block time at which order will be filled
     */
    getIntegratorFee(time, makingAmount = this.srcAmount) {
        const takingAmount = AmountCalculator.calcTakingAmount(makingAmount, this.srcAmount, this.minDstAmount);
        return this.getCalculator().getIntegratorFee(takingAmount, time) ?? 0n;
    }
    /**
     * Fee in `dstToken` which protocol gets to ata account
     *
     * @param makingAmount maker swap amount
     * @param time block time at which order will be filled
     */
    getProtocolFee(time, makingAmount = this.srcAmount) {
        const takingAmount = AmountCalculator.calcTakingAmount(makingAmount, this.srcAmount, this.minDstAmount);
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
        return new AmountCalculator(AuctionCalculator.fromAuctionData(this.orderConfig.dutchAuctionData), FeeCalculator.fromFeeConfig(this.orderConfig.fees));
    }
}
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