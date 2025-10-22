import { AuctionCalculator } from './auction-calculator';
import { FeeCalculator } from './fee-calculator/fee-calculator';
/**
 * Calculates fees/amount with accounting to auction
 *
 * @see FusionOrder
 */
export declare class AmountCalculator {
    private readonly auctionCalculator;
    private readonly feeCalculator?;
    constructor(auctionCalculator: AuctionCalculator, feeCalculator?: FeeCalculator | undefined);
    /**
     * Calculates taker amount by linear proportion
     *
     * @return Ceiled taker amount
     */
    static calcTakingAmount(swapMakerAmount: bigint, orderMakerAmount: bigint, orderTakerAmount: bigint): bigint;
    /**
     * Returns how much resolver must pay to fill order
     *
     * @param takingAmount base taking amount without auction
     * @param time block time at which order will be filled
     */
    getRequiredTakingAmount(takingAmount: bigint, time: number): bigint;
    /**
     * Returns total fee = integrator + protocol
     *
     * @param takingAmount base taking amount without auction and fee
     * @param estimatedTakingAmount taking amount
     * @param time block time at which order will be filled
     */
    getTotalFee(takingAmount: bigint, estimatedTakingAmount: bigint, time: number): bigint;
    /**
     * Returns amount which will receive user
     *
     * @param takingAmount base taking amount without auction
     * @param estimatedTakingAmount taking amount
     * @param time block time at which order will be filled
     */
    getUserReceiveAmount(takingAmount: bigint, estimatedTakingAmount: bigint, time: number): bigint;
    /**
     * Fee in `dstToken` which integrator gets to integrator ata account
     *
     * @param takingAmount base taking amount without auction
     * @param time block time at which order will be filled
     */
    getIntegratorFee(takingAmount: bigint, time: number): bigint;
    /**
     * Fee in `dstToken` which protocol gets to protocol ata account
     *
     * @param takingAmount base taking amount without auction
     * @param estimatedTakingAmount taking amount
     * @param time block time at which order will be filled
     */
    getProtocolFee(takingAmount: bigint, estimatedTakingAmount: bigint, time: number): bigint;
    private getAuctionBumpedAmount;
}
