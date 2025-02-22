import {UINT_16_MAX} from '@1inch/byte-utils'
import {AuctionPoint} from './types'
import {assertUInteger} from '../../utils/validation/assert-uinteger'

export class AuctionDetails {
    public readonly startTime: number

    public readonly duration: number

    public readonly initialRateBump: number

    public readonly points: AuctionPoint[]

    constructor(auction: {
        startTime: number
        /**
         * It defined as a ratio of startTakingAmount to endTakingAmount. 10_000_000 means 100%
         *
         * @see `AuctionCalculator.calcInitialRateBump`
         */
        initialRateBump: number
        duration: number
        points: AuctionPoint[]
    }) {
        this.startTime = auction.startTime
        this.initialRateBump = auction.initialRateBump
        this.duration = auction.duration
        this.points = auction.points

        auction.points.forEach((point) => {
            assertUInteger(point.delay, UINT_16_MAX)
            assertUInteger(point.coefficient, UINT_16_MAX)
        })
        assertUInteger(this.startTime)
        assertUInteger(this.duration)
        assertUInteger(this.initialRateBump, UINT_16_MAX)
    }
}
