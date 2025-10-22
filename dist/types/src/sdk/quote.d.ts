import { Preset } from './preset';
import { PresetType, QuoteDTO } from '../api';
import { FusionOrder } from '../fusion-order';
import { Address } from '../domains';
export declare class Quote {
    readonly srcToken: Address;
    readonly dstToken: Address;
    readonly signer: Address;
    readonly quoteId: string;
    readonly srcAmount: bigint;
    readonly dstAmount: bigint;
    readonly presets: {
        fast: Preset;
        medium: Preset;
        slow: Preset;
    };
    readonly recommendedPreset: PresetType;
    readonly priceImpactPercent: number;
    constructor(srcToken: Address, dstToken: Address, signer: Address, quoteId: string, srcAmount: bigint, dstAmount: bigint, presets: {
        fast: Preset;
        medium: Preset;
        slow: Preset;
    }, recommendedPreset: PresetType, priceImpactPercent: number);
    static fromJSON(srcToken: Address, dstToken: Address, signer: Address, json: QuoteDTO): Quote;
    toOrder(presetType?: PresetType, receiver?: Address, quote?: Quote): FusionOrder;
}
