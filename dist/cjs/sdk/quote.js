"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quote = void 0;
const tslib_1 = require("tslib");
const assert_1 = tslib_1.__importDefault(require("assert"));
const preset_1 = require("./preset");
const fusion_order_1 = require("../fusion-order");
const utils_1 = require("../utils");
class Quote {
    srcToken;
    dstToken;
    signer;
    quoteId;
    srcAmount;
    dstAmount;
    presets;
    recommendedPreset;
    priceImpactPercent;
    constructor(srcToken, dstToken, signer, quoteId, srcAmount, dstAmount, presets, recommendedPreset, priceImpactPercent) {
        this.srcToken = srcToken;
        this.dstToken = dstToken;
        this.signer = signer;
        this.quoteId = quoteId;
        this.srcAmount = srcAmount;
        this.dstAmount = dstAmount;
        this.presets = presets;
        this.recommendedPreset = recommendedPreset;
        this.priceImpactPercent = priceImpactPercent;
    }
    static fromJSON(srcToken, dstToken, signer, json) {
        (0, assert_1.default)(json.quoteId, 'quoteId is required. Use enableEstimate=true to generate it');
        return new Quote(srcToken, dstToken, signer, json.quoteId, BigInt(json.srcAmount), BigInt(json.dstAmount), {
            fast: preset_1.Preset.fromJSON(json.presets.fast),
            medium: preset_1.Preset.fromJSON(json.presets.medium),
            slow: preset_1.Preset.fromJSON(json.presets.slow)
        }, json.recommendedPreset, json.priceImpactPercent);
    }
    toOrder(presetType = this.recommendedPreset, receiver = this.signer, quote) {
        const preset = this.presets[presetType];
        return fusion_order_1.FusionOrder.new({
            srcMint: this.srcToken,
            dstMint: this.dstToken,
            id: (0, utils_1.id)(),
            receiver,
            srcAmount: this.srcAmount,
            estimatedDstAmount: this.dstAmount,
            minDstAmount: preset.auctionEndAmount,
            quote
        }, new fusion_order_1.AuctionDetails({
            startTime: preset.startAuctionIn + (0, utils_1.now)(),
            duration: preset.auctionDuration,
            initialRateBump: preset.initialRateBump,
            points: preset.points
        }));
    }
}
exports.Quote = Quote;
//# sourceMappingURL=quote.js.map