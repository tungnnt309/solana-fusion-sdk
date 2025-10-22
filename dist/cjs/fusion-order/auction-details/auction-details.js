"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuctionDetails = void 0;
const byte_utils_1 = require("@1inch/byte-utils");
const assert_uinteger_1 = require("../../utils/validation/assert-uinteger");
class AuctionDetails {
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
            (0, assert_uinteger_1.assertUInteger)(point.delay, byte_utils_1.UINT_16_MAX);
            (0, assert_uinteger_1.assertUInteger)(point.coefficient, byte_utils_1.UINT_16_MAX);
        });
        (0, assert_uinteger_1.assertUInteger)(this.startTime);
        (0, assert_uinteger_1.assertUInteger)(this.duration);
        (0, assert_uinteger_1.assertUInteger)(this.initialRateBump, byte_utils_1.UINT_16_MAX);
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
exports.AuctionDetails = AuctionDetails;
//# sourceMappingURL=auction-details.js.map