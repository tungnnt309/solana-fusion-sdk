"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuctionCalculator = void 0;
const byte_utils_1 = require("@1inch/byte-utils");
const mul_div_1 = require("../../utils/math/mul-div");
const utils_1 = require("../../utils");
class AuctionCalculator {
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
        (0, utils_1.assertUInteger)(initialRateBump, byte_utils_1.UINT_16_MAX);
        (0, utils_1.assertUInteger)(startTime);
        (0, utils_1.assertUInteger)(duration);
        points.forEach((point) => {
            (0, utils_1.assertUInteger)(point.delay, byte_utils_1.UINT_16_MAX);
            (0, utils_1.assertUInteger)(point.coefficient, byte_utils_1.UINT_16_MAX);
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
        return (0, mul_div_1.mulDiv)(takingAmount, BigInt(rate) + AuctionCalculator.RATE_BUMP_DENOMINATOR, AuctionCalculator.RATE_BUMP_DENOMINATOR, mul_div_1.Rounding.Ceil);
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
exports.AuctionCalculator = AuctionCalculator;
//# sourceMappingURL=auction-calculator.js.map