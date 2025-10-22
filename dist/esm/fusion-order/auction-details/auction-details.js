import { UINT_16_MAX } from '@1inch/byte-utils';
import { assertUInteger } from '../../utils/validation/assert-uinteger';
export class AuctionDetails {
    startTime;
    duration;
    initialRateBump;
    points;
    constructor(auction) {
        this.startTime = auction.startTime;
        this.initialRateBump = auction.initialRateBump;
        this.duration = auction.duration;
        this.points = auction.points;
        auction.points.forEach((point) => {
            assertUInteger(point.delay, UINT_16_MAX);
            assertUInteger(point.coefficient, UINT_16_MAX);
        });
        assertUInteger(this.startTime);
        assertUInteger(this.duration);
        assertUInteger(this.initialRateBump, UINT_16_MAX);
    }
    static noAuction(startTime, duration) {
        return new AuctionDetails({
            startTime,
            duration,
            initialRateBump: 0,
            points: []
        });
    }
}
//# sourceMappingURL=auction-details.js.map