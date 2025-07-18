import {OrderInfoDTO} from '../api'
import {FusionOrder} from '../fusion-order'
import {Address} from '../domains'

export class ActiveOrder {
    constructor(
        public readonly creationTxSignature: string,
        public readonly maker: Address,
        public readonly order: FusionOrder,
        public readonly remainingMakerAmount: bigint
    ) {}

    static fromJSON(json: OrderInfoDTO): ActiveOrder {
        return new ActiveOrder(
            json.txSignature,
            new Address(json.maker),
            FusionOrder.fromJSON(json.order),
            BigInt(json.remainingMakerAmount)
        )
    }
}
