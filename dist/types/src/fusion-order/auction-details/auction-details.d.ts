import { AuctionPoint } from './types';
export declare class AuctionDetails {
    readonly startTime: number;
    readonly duration: number;
    readonly initialRateBump: number;
    readonly points: AuctionPoint[];
    constructor(auction: {
        startTime: number;
        /**
         * It defined as a ratio of startTakingAmount to endTakingAmount. 10_000_000 means 100%
         *
         * @see `AuctionCalculator.calcInitialRateBump`
         */
        initialRateBump: number;
        duration: number;
        points: AuctionPoint[];
    });
    static noAuction(startTime: number, duration: number): AuctionDetails;
}
