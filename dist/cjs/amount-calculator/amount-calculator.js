"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmountCalculator = void 0;
const auction_calculator_1 = require("./auction-calculator");
/**
 * Calculates fees/amount with accounting to auction
 *
 * @see FusionOrder
 */
class AmountCalculator {
    auctionCalculator;
    feeCalculator;
    constructor(auctionCalculator, feeCalculator) {
        this.auctionCalculator = auctionCalculator;
        this.feeCalculator = feeCalculator;
    }
    /**
     * Calculates taker amount by linear proportion
     *
     * @return Ceiled taker amount
     */
    static calcTakingAmount(swapMakerAmount, orderMakerAmount, orderTakerAmount) {
        return ((swapMakerAmount * orderTakerAmount + orderMakerAmount - 1n) /
            orderMakerAmount);
    }
    /**
     * Returns how much resolver must pay to fill order
     *
     * @param takingAmount base taking amount without auction
     * @param time block time at which order will be filled
     */
    getRequiredTakingAmount(takingAmount, time) {
        return this.getAuctionBumpedAmount(takingAmount, time);
    }
    /**
     * Returns total fee = integrator + protocol
     *
     * @param takingAmount base taking amount without auction and fee
     * @param estimatedTakingAmount taking amount
     * @param time block time at which order will be filled
     */
    getTotalFee(takingAmount, estimatedTakingAmount, time) {
        if (!this.feeCalculator) {
            return 0n;
        }
        const auctionAmount = this.getAuctionBumpedAmount(takingAmount, time);
        const integratorFee = this.feeCalculator.getIntegratorFee(auctionAmount);
        const protocolFee = this.feeCalculator.getProtocolFee(auctionAmount, estimatedTakingAmount);
        return integratorFee + protocolFee;
    }
    /**
     * Returns amount which will receive user
     *
     * @param takingAmount base taking amount without auction
     * @param estimatedTakingAmount taking amount
     * @param time block time at which order will be filled
     */
    getUserReceiveAmount(takingAmount, estimatedTakingAmount, time) {
        const auctionAmount = this.getRequiredTakingAmount(takingAmount, time);
        return (this.feeCalculator?.getUserReceiveAmount(auctionAmount, estimatedTakingAmount) ?? auctionAmount);
    }
    /**
     * Fee in `dstToken` which integrator gets to integrator ata account
     *
     * @param takingAmount base taking amount without auction
     * @param time block time at which order will be filled
     */
    getIntegratorFee(takingAmount, time) {
        return (this.feeCalculator?.getIntegratorFee(this.getAuctionBumpedAmount(takingAmount, time)) ?? 0n);
    }
    /**
     * Fee in `dstToken` which protocol gets to protocol ata account
     *
     * @param takingAmount base taking amount without auction
     * @param estimatedTakingAmount taking amount
     * @param time block time at which order will be filled
     */
    getProtocolFee(takingAmount, estimatedTakingAmount, time) {
        return (this.feeCalculator?.getProtocolFee(this.getAuctionBumpedAmount(takingAmount, time), estimatedTakingAmount) ?? 0n);
    }
    getAuctionBumpedAmount(takingAmount, time) {
        const rateBump = this.auctionCalculator.calcRateBump(time);
        return auction_calculator_1.AuctionCalculator.calcAuctionTakingAmount(takingAmount, rateBump);
    }
}
exports.AmountCalculator = AmountCalculator;
//# sourceMappingURL=amount-calculator.js.map