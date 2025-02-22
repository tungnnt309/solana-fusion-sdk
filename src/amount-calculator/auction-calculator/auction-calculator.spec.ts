import {AuctionCalculator} from './auction-calculator'
import {AuctionDetails} from '../../fusion-order'

describe('Auction Calculator', () => {
    it('should be created successfully from suffix and salt', () => {
        const auctionStartTime = 1708448252

        const auctionDetails = new AuctionDetails({
            startTime: auctionStartTime,
            initialRateBump: 50000,
            duration: 120,
            points: []
        })

        const calculator = AuctionCalculator.fromAuctionData(auctionDetails)

        const rate = calculator.calcRateBump(auctionStartTime + 60)
        const auctionTakingAmount = calculator.calcAuctionTakingAmount(
            1420000000n,
            rate
        )

        expect(rate).toBe(25000)
        expect(auctionTakingAmount).toBe(1423550000n) // 1423550000 from rate
    })
})
