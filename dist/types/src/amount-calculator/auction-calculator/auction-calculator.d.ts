import { AuctionDetails, AuctionPoint } from '../../fusion-order';
export declare class AuctionCalculator {
    private readonly startTime;
    private readonly duration;
    private readonly initialRateBump;
    private readonly points;
    static RATE_BUMP_DENOMINATOR: bigint;
    constructor(startTime: number, duration: number, initialRateBump: number, points: AuctionPoint[]);
    get finishTime(): number;
    static fromAuctionData(details: AuctionDetails): AuctionCalculator;
    static calcInitialRateBump(startAmount: bigint, endAmount: bigint): number;
    static calcAuctionTakingAmount(takingAmount: bigint, rate: number): bigint;
    calcAuctionTakingAmount(takingAmount: bigint, blockTime: number): bigint;
    /**
     * @param blockTime timestamp in seconds
     */
    calcRateBump(blockTime: number): number;
}
