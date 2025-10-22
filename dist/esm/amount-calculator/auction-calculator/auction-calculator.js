import { UINT_16_MAX } from '@1inch/byte-utils';
import { mulDiv, Rounding } from '../../utils/math/mul-div';
import { assertUInteger } from '../../utils';
export class AuctionCalculator {
    startTime;
    duration;
    initialRateBump;
    points;
    static RATE_BUMP_DENOMINATOR = 100000n; // 100%
    constructor(startTime, duration, initialRateBump, points) {
        this.startTime = startTime;
        this.duration = duration;
        this.initialRateBump = initialRateBump;
        this.points = points;
        assertUInteger(initialRateBump, UINT_16_MAX);
        assertUInteger(startTime);
        assertUInteger(duration);
        points.forEach((point) => {
            assertUInteger(point.delay, UINT_16_MAX);
            assertUInteger(point.coefficient, UINT_16_MAX);
        });
    }
    get finishTime() {
        return this.startTime + this.duration;
    }
    static fromAuctionData(details) {
        return new AuctionCalculator(details.startTime, details.duration, details.initialRateBump, details.points);
    }
    static calcInitialRateBump(startAmount, endAmount) {
        const bump = (AuctionCalculator.RATE_BUMP_DENOMINATOR * startAmount) /
            endAmount -
            AuctionCalculator.RATE_BUMP_DENOMINATOR;
        return Number(bump);
    }
    static calcAuctionTakingAmount(takingAmount, rate) {
        return mulDiv(takingAmount, BigInt(rate) + AuctionCalculator.RATE_BUMP_DENOMINATOR, AuctionCalculator.RATE_BUMP_DENOMINATOR, Rounding.Ceil);
    }
    calcAuctionTakingAmount(takingAmount, blockTime) {
        return AuctionCalculator.calcAuctionTakingAmount(takingAmount, this.calcRateBump(blockTime));
    }
    /**
     * @param blockTime timestamp in seconds
     */
    calcRateBump(blockTime) {
        const auctionFinishTime = this.finishTime;
        if (blockTime <= this.startTime) {
            return this.initialRateBump;
        }
        else if (blockTime >= auctionFinishTime) {
            return 0;
        }
        let currentRateBump = BigInt(this.initialRateBump);
        let currentPointTime = BigInt(this.startTime);
        const blockTimeBN = BigInt(blockTime);
        for (const { coefficient: nextRateBump, delay } of this.points) {
            const nextPointTime = BigInt(delay) + currentPointTime;
            if (blockTimeBN <= nextPointTime) {
                return Number(((blockTimeBN - currentPointTime) * BigInt(nextRateBump) +
                    (nextPointTime - blockTimeBN) * currentRateBump) /
                    (nextPointTime - currentPointTime));
            }
            currentPointTime = nextPointTime;
            currentRateBump = BigInt(nextRateBump);
        }
        return Number(((BigInt(auctionFinishTime) - blockTimeBN) * currentRateBump) /
            (BigInt(auctionFinishTime) - currentPointTime));
    }
}
//# sourceMappingURL=auction-calculator.js.map