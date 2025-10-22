"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeeCalculator = void 0;
const fusion_order_1 = require("../../fusion-order");
const utils_1 = require("../../utils");
class FeeCalculator {
    protocolFee;
    integratorFee;
    surplusShare;
    constructor(protocolFee, integratorFee, surplusShare) {
        this.protocolFee = protocolFee;
        this.integratorFee = integratorFee;
        this.surplusShare = surplusShare;
    }
    static fromFeeConfig(feeConfig) {
        return new FeeCalculator(feeConfig.protocolFee, feeConfig.integratorFee, feeConfig.surplusShare);
    }
    /**
     * Fee in `dstToken` which integrator gets to integrator ata account
     *
     * @param auctionTakingAmount taking amount with auction bump applied
     */
    getIntegratorFee(auctionTakingAmount) {
        return (0, utils_1.mulDiv)(auctionTakingAmount, BigInt(this.integratorFee.toFraction(fusion_order_1.FeeConfig.BASE_1E5)), fusion_order_1.FeeConfig.BASE_1E5, utils_1.Rounding.Floor);
    }
    /**
     * Returns amount which will receive user
     *
     * @param auctionTakingAmount taking amount with auction bump applied
     * @param estimatedTakingAmount estimated taking amount
     */
    getUserReceiveAmount(auctionTakingAmount, estimatedTakingAmount) {
        return this.getAmounts(auctionTakingAmount, estimatedTakingAmount)
            .userReceiveAmount;
    }
    /**
     * Fee in `dstToken` which protocol gets to protocol ata account
     *
     * @param auctionTakingAmount taking amount with auction bump applied
     * @param estimatedTakingAmount estimated taking amount
     */
    getProtocolFee(auctionTakingAmount, estimatedTakingAmount) {
        return this.getAmounts(auctionTakingAmount, estimatedTakingAmount)
            .protocolFeeAmount;
    }
    getAmounts(auctionTakingAmount, estimatedTakingAmount) {
        let protocolFee = (0, utils_1.mulDiv)(auctionTakingAmount, BigInt(this.protocolFee.toFraction(fusion_order_1.FeeConfig.BASE_1E5)), fusion_order_1.FeeConfig.BASE_1E5, utils_1.Rounding.Floor);
        const integratorFee = this.getIntegratorFee(auctionTakingAmount);
        const userAmountWithoutFee = auctionTakingAmount - protocolFee - integratorFee;
        if (userAmountWithoutFee > estimatedTakingAmount) {
            protocolFee += (0, utils_1.mulDiv)(userAmountWithoutFee - estimatedTakingAmount, BigInt(this.surplusShare.toFraction(fusion_order_1.FeeConfig.BASE_1E2)), fusion_order_1.FeeConfig.BASE_1E2, utils_1.Rounding.Floor);
        }
        return {
            protocolFeeAmount: protocolFee,
            userReceiveAmount: auctionTakingAmount - protocolFee - integratorFee
        };
    }
}
exports.FeeCalculator = FeeCalculator;
//# sourceMappingURL=fee-calculator.js.map