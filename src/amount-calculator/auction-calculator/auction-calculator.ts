import {AuctionDetails, AuctionPoint} from '../../fusion-order'
import {mulDiv, Rounding} from '../../utils/math/mul-div'

export class AuctionCalculator {
    public static RATE_BUMP_DENOMINATOR = 100_000n // 100%

    constructor(
        private readonly startTime: number,
        private readonly duration: number,
        private readonly initialRateBump: number,
        private readonly points: AuctionPoint[]
    ) {}

    get finishTime(): number {
        return this.startTime + this.duration
    }

    static fromAuctionData(details: AuctionDetails): AuctionCalculator {
        return new AuctionCalculator(
            details.startTime,
            details.duration,
            details.initialRateBump,
            details.points
        )
    }

    static calcInitialRateBump(startAmount: bigint, endAmount: bigint): number {
        const bump =
            (AuctionCalculator.RATE_BUMP_DENOMINATOR * startAmount) /
                endAmount -
            AuctionCalculator.RATE_BUMP_DENOMINATOR

        return Number(bump)
    }

    static calcAuctionTakingAmount(takingAmount: bigint, rate: number): bigint {
        return mulDiv(
            takingAmount,
            BigInt(rate) + AuctionCalculator.RATE_BUMP_DENOMINATOR,
            AuctionCalculator.RATE_BUMP_DENOMINATOR,
            Rounding.Ceil
        )
    }

    public calcAuctionTakingAmount(
        takingAmount: bigint,
        blockTime: number
    ): bigint {
        return AuctionCalculator.calcAuctionTakingAmount(
            takingAmount,
            this.calcRateBump(blockTime)
        )
    }

    /**
     * @param blockTime timestamp in seconds
     */
    public calcRateBump(blockTime: number): number {
        const auctionFinishTime = this.finishTime

        if (blockTime <= this.startTime) {
            return this.initialRateBump
        } else if (blockTime >= auctionFinishTime) {
            return 0
        }

        let currentRateBump = this.initialRateBump
        let currentPointTime = this.startTime

        for (const {coefficient: nextRateBump, delay} of this.points) {
            const nextPointTime = delay + currentPointTime

            if (blockTime <= nextPointTime) {
                return (
                    ((blockTime - currentPointTime) * nextRateBump +
                        (nextPointTime - blockTime) * currentRateBump) /
                    (nextPointTime - currentPointTime)
                )
            }

            currentPointTime = nextPointTime
            currentRateBump = nextRateBump
        }

        return (
            ((auctionFinishTime - blockTime) * currentRateBump) /
            (auctionFinishTime - currentPointTime)
        )
    }
}
