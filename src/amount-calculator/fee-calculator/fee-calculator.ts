import {Bps} from '../../domains'
import {FeeConfig} from '../../fusion-order/fee-config'

export class FeeCalculator {
    constructor(
        public readonly protocolFee: Bps,
        public readonly integratorFee: Bps,
        public readonly surplusShare: Bps
    ) {}

    static fromFeeConfig(feeConfig: FeeConfig): FeeCalculator {
        return new FeeCalculator(
            feeConfig.protocolFee,
            feeConfig.integratorFee,
            feeConfig.surplusShare
        )
    }

    // /**
    //  * Fee in `takerAsset` which integrator gets to integrator wallet
    //  *
    //  * @param taker who will fill order
    //  * @param orderTakingAmount taking amount from order struct
    //  */
    // public getIntegratorFee(taker: Address, orderTakingAmount: bigint): bigint {
    //     // the logic copied from contract to avoid calculation issues
    //     // @see https://github.com/1inch/limit-order-protocol/blob/22a18f7f20acfec69d4f50ce1880e8e662477710/contracts/extensions/FeeTaker.sol#L145
    //
    //     const takingAmount = this.getTakingAmount(taker, orderTakingAmount)
    //     const fees = this.getFeesForTaker(taker)
    //
    //     const total = mulDiv(
    //         takingAmount,
    //         fees.integratorFee,
    //         FeeConfig.BASE_1E5 + fees.resolverFee + fees.integratorFee
    //     )
    //
    //     return mulDiv(
    //         total,
    //         BigInt(this.fees.integratorFee..toFraction(Fees.BASE_1E2)),
    //         Fees.BASE_1E2
    //     )
    // }
    //
    // /**
    //  * Fee in `takerAsset` which protocol gets as share from integrator fee
    //  *
    //  * @param taker who will fill order
    //  * @param orderTakingAmount taking amount from order struct
    //  */
    // public getProtocolShareOfIntegratorFee(
    //     taker: Address,
    //     orderTakingAmount: bigint
    // ): bigint {
    //     // the logic copied from contract to avoid calculation issues
    //     // @see https://github.com/1inch/limit-order-protocol/blob/22a18f7f20acfec69d4f50ce1880e8e662477710/contracts/extensions/FeeTaker.sol#L145
    //
    //     const takingAmount = this.getTakingAmount(taker, orderTakingAmount)
    //     const fees = this.getFeesForTaker(taker)
    //
    //     const total = mulDiv(
    //         takingAmount,
    //         fees.integratorFee,
    //         Fees.BASE_1E5 + fees.resolverFee + fees.integratorFee
    //     )
    //
    //     return total - this.getIntegratorFee(taker, orderTakingAmount)
    // }
    //
    // /**
    //  * Fee in `takerAsset` which protocol gets
    //  * It equals to `share from integrator fee plus resolver fee`
    //  *
    //  * @param taker who will fill order
    //  * @param orderTakingAmount taking amount from order struct
    //  */
    // public getProtocolFee(taker: Address, orderTakingAmount: bigint): bigint {
    //     const resolverFee = this.getResolverFee(taker, orderTakingAmount)
    //     const integratorPart = this.getProtocolShareOfIntegratorFee(
    //         taker,
    //         orderTakingAmount
    //     )
    //
    //     return integratorPart + resolverFee
    // }
}
