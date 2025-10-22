import { PresetDTO } from '../api';
export declare class Preset {
    readonly startAuctionIn: number;
    readonly auctionDuration: number;
    readonly initialRateBump: number;
    readonly auctionStartAmount: bigint;
    readonly auctionEndAmount: bigint;
    readonly costInDstToken: bigint;
    readonly points: Array<{
        delay: number;
        coefficient: number;
    }>;
    constructor(startAuctionIn: number, auctionDuration: number, initialRateBump: number, auctionStartAmount: bigint, auctionEndAmount: bigint, costInDstToken: bigint, points: Array<{
        delay: number;
        coefficient: number;
    }>);
    static fromJSON(json: PresetDTO): Preset;
}
