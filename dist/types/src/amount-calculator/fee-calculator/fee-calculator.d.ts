import { Bps } from '../../domains';
import { FeeConfig } from '../../fusion-order';
export declare class FeeCalculator {
    readonly protocolFee: Bps;
    readonly integratorFee: Bps;
    readonly surplusShare: Bps;
    constructor(protocolFee: Bps, integratorFee: Bps, surplusShare: Bps);
    static fromFeeConfig(feeConfig: FeeConfig): FeeCalculator;
    /**
     * Fee in `dstToken` which integrator gets to integrator ata account
     *
     * @param auctionTakingAmount taking amount with auction bump applied
     */
    getIntegratorFee(auctionTakingAmount: bigint): bigint;
    /**
     * Returns amount which will receive user
     *
     * @param auctionTakingAmount taking amount with auction bump applied
     * @param estimatedTakingAmount estimated taking amount
     */
    getUserReceiveAmount(auctionTakingAmount: bigint, estimatedTakingAmount: bigint): bigint;
    /**
     * Fee in `dstToken` which protocol gets to protocol ata account
     *
     * @param auctionTakingAmount taking amount with auction bump applied
     * @param estimatedTakingAmount estimated taking amount
     */
    getProtocolFee(auctionTakingAmount: bigint, estimatedTakingAmount: bigint): bigint;
    private getAmounts;
}
