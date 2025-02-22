import {BorshCoder, BN} from '@coral-xyz/anchor'
import * as crypto from 'node:crypto'
import {AuctionDetails} from './auction-details'

import {FeeConfig} from './fee-config'
import {OrderInfoData} from './types'
import {Address, AddressLike, Bps} from '../domains'
import {AmountCalculator, AuctionCalculator} from '../amount-calculator'
import {FeeCalculator} from '../amount-calculator/fee-calculator/fee-calculator'
import {IDL} from '../idl/fusion-swap'

export class FusionOrder {
    private static DefaultExtra = {
        unwrapNative: false,
        orderExpirationDelay: 12,
        fees: FeeConfig.ZERO
    }

    private readonly orderConfig: {
        id: number // u32
        srcAmount: bigint // u64
        minDstAmount: bigint // u64
        estimatedDstAmount: bigint // u64
        expirationTime: number // u32
        nativeDstAsset: boolean
        receiver: Address
        fees: FeeConfig
        dutchAuctionData: AuctionDetails
        srcMint: Address
        dstMint: Address
    }

    public constructor(
        orderInfo: OrderInfoData,
        auctionDetails: AuctionDetails,
        extra: {
            unwrapNative?: boolean
            /**
             * Order will expire in `orderExpirationDelay` after auction ends
             * Default 12s
             */
            orderExpirationDelay?: number
            fees?: FeeConfig
        } = FusionOrder.DefaultExtra
    ) {
        // validate amounts

        const unwrapNative =
            extra.unwrapNative ?? FusionOrder.DefaultExtra.unwrapNative

        const orderExpirationDelay =
            extra.orderExpirationDelay ??
            FusionOrder.DefaultExtra.orderExpirationDelay

        const deadline =
            auctionDetails.startTime +
            auctionDetails.duration +
            orderExpirationDelay

        const fees = extra.fees || FusionOrder.DefaultExtra.fees

        this.orderConfig = {
            ...orderInfo,
            dutchAuctionData: auctionDetails,
            fees,
            nativeDstAsset: unwrapNative,
            expirationTime: deadline
        }
    }

    get takerAsset(): Address {
        return this.orderConfig.dstMint
    }

    get makerAsset(): Address {
        return this.orderConfig.srcMint
    }

    get takingAmount(): bigint {
        return this.orderConfig.minDstAmount
    }

    get makingAmount(): bigint {
        return this.orderConfig.srcAmount
    }

    /**
     * Receiver of funds
     */
    get receiver(): Address {
        return this.orderConfig.receiver
    }

    /**
     * Timestamp in sec
     */
    get deadline(): number {
        return this.orderConfig.expirationTime
    }

    /**
     * Timestamp in sec
     */
    get auctionStartTime(): number {
        return this.orderConfig.dutchAuctionData.startTime
    }

    /**
     * Timestamp in sec
     */
    get auctionEndTime(): number {
        const {startTime, duration} = this.orderConfig.dutchAuctionData

        return startTime + duration
    }

    get id(): number {
        return this.orderConfig.id
    }

    static decode(
        str: string,
        encoding: 'base64' | 'hex' = 'base64'
    ): FusionOrder {
        const coder = new BorshCoder(IDL)

        const config = coder.types.decode<BorchOrderConfig>(
            'orderConfig',
            Buffer.from(str, encoding)
        )

        const {dutchAuctionData: auction, fee: fees} = config

        return new FusionOrder(
            {
                srcMint: Address.fromBuffer(config.srcMint.toBuffer()),
                dstMint: Address.fromBuffer(config.dstMint.toBuffer()),
                srcAmount: BigInt(config.srcAmount.toString()),
                minDstAmount: BigInt(config.minDstAmount.toString()),
                estimatedDstAmount: BigInt(
                    config.estimatedDstAmount.toString()
                ),
                receiver: Address.fromBuffer(config.receiver.toBuffer()),
                id: config.id
            },
            new AuctionDetails({
                duration: auction.duration,
                initialRateBump: auction.initialRateBump,
                startTime: auction.startTime,
                points: auction.pointsAndTimeDeltas.map((p) => ({
                    delay: p.timeDelta,
                    coefficient: p.rateBump
                }))
            }),
            {
                unwrapNative: config.nativeDstAsset,
                fees: new FeeConfig(
                    fees.protocolDstAta
                        ? Address.fromBuffer(fees.protocolDstAta?.toBuffer())
                        : null,
                    fees.integratorDstAta
                        ? Address.fromBuffer(fees.integratorDstAta?.toBuffer())
                        : null,
                    Bps.fromFraction(fees.protocolFee, FeeConfig.BASE_1E5),
                    Bps.fromFraction(fees.integratorFee, FeeConfig.BASE_1E5),
                    Bps.fromFraction(fees.surplusPercentage, FeeConfig.BASE_1E2)
                )
            }
        )
    }

    public encode(encoding: 'hex' | 'base64' = 'base64'): string {
        const coder = new BorshCoder(IDL)

        const {fees, dutchAuctionData: auction} = this.orderConfig

        return coder.types
            .encode<BorchOrderConfig>('orderConfig', {
                id: this.orderConfig.id,
                srcAmount: new BN(this.orderConfig.srcAmount),
                minDstAmount: new BN(this.orderConfig.minDstAmount),
                estimatedDstAmount: new BN(this.orderConfig.estimatedDstAmount),
                expirationTime: this.orderConfig.expirationTime,
                nativeDstAsset: this.orderConfig.nativeDstAsset,
                receiver: this.orderConfig.receiver,
                fee: {
                    protocolDstAta: fees.protocolDstAta,
                    integratorDstAta: fees.integratorDstAta,
                    protocolFee: fees.protocolFee.toFraction(
                        FeeConfig.BASE_1E5
                    ),
                    integratorFee: fees.integratorFee.toFraction(
                        FeeConfig.BASE_1E5
                    ),
                    surplusPercentage: fees.surplusShare.toFraction(
                        FeeConfig.BASE_1E2
                    )
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
                srcMint: this.orderConfig.srcMint,
                dstMint: this.orderConfig.dstMint
            })
            .toString(encoding)
    }

    /**
     * Returns orderHash as hex string (without 0x)
     */
    public getOrderHash(): string {
        return crypto.createHash('sha256').update(this.encode()).digest('hex')
    }

    /**
     * Calculates required taking amount to fill order for passed `makingAmount` at block time `time`
     *
     * @param time execution time in sec
     * @param makingAmount maker swap amount
     * */
    public calcTakingAmount(makingAmount: bigint, time: number): bigint {
        const takingAmount = AmountCalculator.calcTakingAmount(
            makingAmount,
            this.makingAmount,
            this.takingAmount
        )

        return this.getCalculator().getRequiredTakingAmount(takingAmount, time)
    }

    // /**
    //  * How much user will receive in taker asset
    //  *
    //  * @param taker who will fill order
    //  * @param makingAmount maker swap amount
    //  * @param time block time at which order will be filled
    //  * @param blockBaseFee base fee of block at which order will be filled
    //  */
    // public getUserReceiveAmount(
    //     taker: Address,
    //     makingAmount: bigint,
    //     time: bigint,
    //     blockBaseFee = 0n
    // ): bigint {
    //     const takingAmount = calcTakingAmount(
    //         makingAmount,
    //         this.makingAmount,
    //         this.takingAmount
    //     )
    //
    //     return this.getAmountCalculator().getUserTakingAmountAmount(
    //         taker,
    //         takingAmount,
    //         time,
    //         blockBaseFee
    //     )
    // }

    // /**
    //  * Fee in `takerAsset` which integrator gets to integrator wallet
    //  *
    //  * @param taker who will fill order
    //  * @param makingAmount maker swap amount
    //  * @param time block time at which order will be filled
    //  * @param blockBaseFee base fee of block at which order will be filled
    //  */
    // public getIntegratorFee(
    //     taker: Address,
    //     time: bigint,
    //     blockBaseFee = 0n,
    //     makingAmount = this.makingAmount
    // ): bigint {
    //     const takingAmount = calcTakingAmount(
    //         makingAmount,
    //         this.makingAmount,
    //         this.takingAmount
    //     )
    //
    //     return (
    //         this.getAmountCalculator().getIntegratorFee(
    //             taker,
    //             takingAmount,
    //             time,
    //             blockBaseFee
    //         ) ?? 0n
    //     )
    // }

    // /**
    //  * Fee in `takerAsset` which protocol gets as share from integrator fee
    //  *
    //  * @param taker who will fill order
    //  * @param makingAmount maker swap amount
    //  * @param time block time at which order will be filled
    //  * @param blockBaseFee base fee of block at which order will be filled
    //  */
    // public getProtocolShareOfIntegratorFee(
    //     taker: Address,
    //     time: bigint,
    //     blockBaseFee = 0n,
    //     makingAmount = this.makingAmount
    // ): bigint {
    //     const takingAmount = calcTakingAmount(
    //         makingAmount,
    //         this.makingAmount,
    //         this.takingAmount
    //     )
    //
    //     return (
    //         this.getAmountCalculator().getProtocolShareOfIntegratorFee(
    //             taker,
    //             takingAmount,
    //             time,
    //             blockBaseFee
    //         ) ?? 0n
    //     )
    // }

    // /**
    //  * Fee in `takerAsset` which protocol gets
    //  * It equals to `share from integrator fee plus resolver fee`
    //  *
    //  * @param taker who will fill order
    //  * @param makingAmount maker swap amount
    //  * @param time block time at which order will be filled
    //  * @param blockBaseFee base fee of block at which order will be filled
    //  */
    // public getProtocolFee(
    //     taker: Address,
    //     time: bigint,
    //     blockBaseFee = 0n,
    //     makingAmount = this.makingAmount
    // ): bigint {
    //     const takingAmount = calcTakingAmount(
    //         makingAmount,
    //         this.makingAmount,
    //         this.takingAmount
    //     )
    //
    //     return (
    //         this.getAmountCalculator().getProtocolFee(
    //             taker,
    //             takingAmount,
    //             time,
    //             blockBaseFee
    //         ) ?? 0n
    //     )
    // }

    /**
     * Check is order expired at a given time
     *
     * @param time timestamp in seconds
     */
    public isExpiredAt(time: bigint): boolean {
        return time > this.deadline
    }

    public getCalculator(): AmountCalculator {
        return new AmountCalculator(
            AuctionCalculator.fromAuctionData(
                this.orderConfig.dutchAuctionData
            ),
            FeeCalculator.fromFeeConfig(this.orderConfig.fees)
        )
    }
}

type BorchOrderConfig = {
    id: number
    srcAmount: BN
    minDstAmount: BN
    estimatedDstAmount: BN
    expirationTime: number
    nativeDstAsset: boolean
    receiver: AddressLike
    fee: {
        protocolDstAta: AddressLike | null
        integratorDstAta: AddressLike | null
        protocolFee: number
        integratorFee: number
        surplusPercentage: number
    }
    dutchAuctionData: {
        startTime: number
        duration: number
        initialRateBump: number
        pointsAndTimeDeltas: {
            rateBump: number
            timeDelta: number
        }[]
    }
    srcMint: AddressLike
    dstMint: AddressLike
}
