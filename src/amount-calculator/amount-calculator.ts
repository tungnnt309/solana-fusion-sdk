import {AuctionCalculator} from './auction-calculator'
import {FeeCalculator} from './fee-calculator/fee-calculator'

/**
 * Calculates fees/amount with accounting to auction
 *
 * @see FusionOrder
 */
export class AmountCalculator {
    constructor(
        private readonly auctionCalculator: AuctionCalculator,
        private readonly feeCalculator?: FeeCalculator
    ) {}

    /**
     * Calculates taker amount by linear proportion
     *
     * @return Ceiled taker amount
     */
    static calcTakingAmount(
        swapMakerAmount: bigint,
        orderMakerAmount: bigint,
        orderTakerAmount: bigint
    ): bigint {
        return (
            (swapMakerAmount * orderTakerAmount + orderMakerAmount - 1n) /
            orderMakerAmount
        )
    }

    /**
     * Returns how much resolver must pay to fill order
     *
     * @param takingAmount base taking amount without auction
     * @param time block time at which order will be filled
     */
    public getRequiredTakingAmount(takingAmount: bigint, time: number): bigint {
        return this.getAuctionBumpedAmount(takingAmount, time)
    }
    //
    // /**
    //  * Returns total fee = integrator + protocol
    //  *
    //  * @param taker
    //  * @param takingAmount base taking amount without auction and fee
    //  * @param time block time at which order will be filled
    //  * @param blockBaseFee base fee of block at which order will be filled
    //  */
    // public getTotalFee(
    //     taker: Address,
    //     takingAmount: bigint,
    //     time: bigint,
    //     blockBaseFee = 0n
    // ): bigint {
    //     return (
    //         this.getIntegratorFee(taker, takingAmount, time, blockBaseFee) +
    //         this.getProtocolFee(taker, takingAmount, time, blockBaseFee)
    //     )
    // }
    //
    // /**
    //  * Returns amount which will receive user
    //  *
    //  * @param takingAmount base taking amount without auction and fee
    //  * @param time block time at which order will be filled
    //  */
    // public getUserTakingAmount(takingAmount: bigint, time: number): bigint {
    //     const auctionAmount = this.getRequiredTakingAmount(takingAmount, time)
    //
    //     return auctionAmount - this.getTotalFee(auctionAmount, time)
    // }
    //
    // /**
    //  * Fee in `takerAsset` which integrator gets to integrator wallet
    //  *
    //  * @param taker who will fill order
    //  * @param takingAmount taking amount to calculate fee from, must be without fees/auction adjustments
    //  * @param time block time at which order will be filled
    //  * @param blockBaseFee base fee of block at which order will be filled
    //  */
    // public getIntegratorFee(
    //     taker: Address,
    //     takingAmount: bigint,
    //     time: bigint,
    //     blockBaseFee = 0n
    // ): bigint {
    //     return (
    //         this.feeCalculator?.getIntegratorFee(
    //             taker,
    //             this.getAuctionBumpedAmount(takingAmount, time, blockBaseFee)
    //         ) ?? 0n
    //     )
    // }
    //
    // /**
    //  * Fee in `takerAsset` which protocol gets as share from integrator fee
    //  *
    //  * @param taker who will fill order
    //  * @param takingAmount taking amount to calculate fee from, must be without fees/auction adjustments
    //  * @param time block time at which order will be filled
    //  * @param blockBaseFee base fee of block at which order will be filled
    //  */
    // public getProtocolShareOfIntegratorFee(
    //     taker: Address,
    //     takingAmount: bigint,
    //     time: bigint,
    //     blockBaseFee = 0n
    // ): bigint {
    //     return (
    //         this.feeCalculator?.getProtocolShareOfIntegratorFee(
    //             taker,
    //             this.getAuctionBumpedAmount(takingAmount, time, blockBaseFee)
    //         ) ?? 0n
    //     )
    // }
    //
    // /**
    //  * Fee in `takerAsset` which protocol gets
    //  * It equals to `share from integrator fee plus resolver fee`
    //  *
    //  * @param taker who will fill order
    //  * @param takingAmount taking amount to calculate fee from, must be without fees/auction adjustments
    //  * @param time block time at which order will be filled
    //  * @param blockBaseFee base fee of block at which order will be filled
    //  */
    // public getProtocolFee(
    //     taker: Address,
    //     takingAmount: bigint,
    //     time: bigint,
    //     blockBaseFee = 0n
    // ): bigint {
    //     return (
    //         this.feeCalculator?.getProtocolFee(
    //             taker,
    //             this.getAuctionBumpedAmount(takingAmount, time, blockBaseFee)
    //         ) ?? 0n
    //     )
    // }

    private getAuctionBumpedAmount(takingAmount: bigint, time: number): bigint {
        const rateBump = this.auctionCalculator.calcRateBump(time)

        return AuctionCalculator.calcAuctionTakingAmount(takingAmount, rateBump)
    }
}
