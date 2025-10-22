import assert from 'assert';
import { Preset } from './preset';
import { AuctionDetails, FusionOrder } from '../fusion-order';
import { id, now } from '../utils';
export class Quote {
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
        assert(json.quoteId, 'quoteId is required. Use enableEstimate=true to generate it');
        return new Quote(srcToken, dstToken, signer, json.quoteId, BigInt(json.srcAmount), BigInt(json.dstAmount), {
            fast: Preset.fromJSON(json.presets.fast),
            medium: Preset.fromJSON(json.presets.medium),
            slow: Preset.fromJSON(json.presets.slow)
        }, json.recommendedPreset, json.priceImpactPercent);
    }
    toOrder(presetType = this.recommendedPreset, receiver = this.signer, quote) {
        const preset = this.presets[presetType];
        return FusionOrder.new({
            srcMint: this.srcToken,
            dstMint: this.dstToken,
            id: id(),
            receiver,
            srcAmount: this.srcAmount,
            estimatedDstAmount: this.dstAmount,
            minDstAmount: preset.auctionEndAmount,
            quote
        }, new AuctionDetails({
            startTime: preset.startAuctionIn + now(),
            duration: preset.auctionDuration,
            initialRateBump: preset.initialRateBump,
            points: preset.points
        }));
    }
}
//# sourceMappingURL=quote.js.map