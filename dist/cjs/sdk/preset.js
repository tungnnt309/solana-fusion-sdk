"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Preset = void 0;
class Preset {
    startAuctionIn;
    auctionDuration;
    initialRateBump;
    auctionStartAmount;
    auctionEndAmount;
    costInDstToken;
    points;
    constructor(startAuctionIn, auctionDuration, initialRateBump, auctionStartAmount, auctionEndAmount, costInDstToken, points) {
        this.startAuctionIn = startAuctionIn;
        this.auctionDuration = auctionDuration;
        this.initialRateBump = initialRateBump;
        this.auctionStartAmount = auctionStartAmount;
        this.auctionEndAmount = auctionEndAmount;
        this.costInDstToken = costInDstToken;
        this.points = points;
    }
    static fromJSON(json) {
        return new Preset(json.startAuctionIn, json.auctionDuration, json.initialRateBump, BigInt(json.auctionStartAmount), BigInt(json.auctionEndAmount), BigInt(json.costInDstToken), json.points);
    }
}
exports.Preset = Preset;
//# sourceMappingURL=preset.js.map