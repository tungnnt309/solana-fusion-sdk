import { BN } from '@coral-xyz/anchor';
import { Buffer } from 'buffer';
import { AuctionDetails } from './auction-details';
import { FeeConfig } from './fee-config';
import { OrderInfoData } from './types';
import { ResolverCancellationConfig } from './resolver-cancellation-config';
import { Address, AddressLike } from '../domains';
import { AmountCalculator } from '../amount-calculator';
import { TransactionInstruction } from '../contracts';
export declare class FusionOrder {
    private static DefaultExtra;
    private readonly orderConfig;
    private constructor();
    get fees(): FeeConfig | null;
    get resolverCancellationConfig(): ResolverCancellationConfig | null;
    get srcMint(): Address;
    get dstMint(): Address;
    get srcAmount(): bigint;
    get minDstAmount(): bigint;
    get estimatedDstAmount(): bigint;
    /**
     * Receiver of funds
     */
    get receiver(): Address;
    /**
     * Timestamp in sec
     */
    get deadline(): number;
    /**
     * Timestamp in sec
     */
    get auctionStartTime(): number;
    /**
     * Timestamp in sec
     */
    get auctionEndTime(): number;
    get auctionDetails(): AuctionDetails;
    get id(): number;
    get srcAssetIsNative(): boolean;
    get dstAssetIsNative(): boolean;
    static new(orderInfo: OrderInfoData, auctionDetails: AuctionDetails, extra?: {
        /**
         * Order will expire in `orderExpirationDelay` after auction ends
         * Default 12s
         */
        orderExpirationDelay?: number;
        fees?: FeeConfig;
        resolverCancellationConfig?: ResolverCancellationConfig;
    }): FusionOrder;
    static fromCreateInstruction(ix: TransactionInstruction): FusionOrder;
    static fromFillInstruction(ix: TransactionInstruction): FusionOrder;
    static fromResolverCancelInstruction(ix: TransactionInstruction): FusionOrder;
    static fromContractOrder(reducedConfig: ContractOrderConfig, accounts: {
        srcMint: Address;
        dstMint: Address;
        receiver: Address;
        protocolDstAta: Address;
        integratorDstAta: Address;
        programId: Address;
    }): FusionOrder;
    static fromJSON(json: FusionOrderJSON): FusionOrder;
    build(): ContractOrderConfig;
    toJSON(): FusionOrderJSON;
    /**
     * Returns orderHash
     */
    getOrderHash(): Buffer;
    getOrderHashBase58(): string;
    /**
     * Returns escrow ata for src token
     */
    getEscrow(maker: AddressLike, 
    /**
     * Src token program id - TOKEN_PROGRAM_ID or TOKEN_2020_PROGRAM_ID
     */
    srcTokenProgram?: AddressLike, 
    /**
     * FusionSwap program id
     */
    programId?: AddressLike): Address;
    /**
     * Calculates required taking amount to fill order for passed `makingAmount` at block time `time`
     *
     * @param makingAmount maker swap amount
     * @param time execution time in sec
     * */
    calcTakingAmount(makingAmount: bigint, time: number): bigint;
    /**
     * How much user will receive in dst token
     *
     * @param makingAmount maker swap amount
     * @param time block time at which order will be filled
     */
    getUserReceiveAmount(makingAmount: bigint, time: number): bigint;
    /**
     * Fee in `dstToken` which integrator gets to integrator ata account
     *
     * @param makingAmount maker swap amount
     * @param time block time at which order will be filled
     */
    getIntegratorFee(time: number, makingAmount?: bigint): bigint;
    /**
     * Fee in `dstToken` which protocol gets to ata account
     *
     * @param makingAmount maker swap amount
     * @param time block time at which order will be filled
     */
    getProtocolFee(time: number, makingAmount?: bigint): bigint;
    /**
     * Check is order expired at a given time
     *
     * @param time timestamp in seconds
     */
    isExpiredAt(time: bigint): boolean;
    getCalculator(): AmountCalculator;
}
type ContractOrderConfig = {
    id: number;
    srcAmount: BN;
    minDstAmount: BN;
    estimatedDstAmount: BN;
    expirationTime: number;
    srcAssetIsNative: boolean;
    dstAssetIsNative: boolean;
    cancellationAuctionDuration: number;
    fee: {
        protocolFee: number;
        integratorFee: number;
        surplusPercentage: number;
        maxCancellationPremium: BN;
    };
    dutchAuctionData: {
        startTime: number;
        duration: number;
        initialRateBump: number;
        pointsAndTimeDeltas: {
            rateBump: number;
            timeDelta: number;
        }[];
    };
};
export type FusionOrderJSON = {
    id: number;
    receiver: string;
    cancellationAuctionDuration: number;
    srcMint: string;
    dstMint: string;
    srcAmount: string;
    minDstAmount: string;
    estimatedDstAmount: string;
    expirationTime: number;
    srcAssetIsNative: boolean;
    dstAssetIsNative: boolean;
    fee: {
        protocolDstAta: string | null;
        integratorDstAta: string | null;
        protocolFee: number;
        integratorFee: number;
        surplusPercentage: number;
        maxCancellationPremium: string;
    };
    dutchAuctionData: {
        startTime: number;
        duration: number;
        initialRateBump: number;
        pointsAndTimeDeltas: {
            rateBump: number;
            timeDelta: number;
        }[];
    };
};
export {};
