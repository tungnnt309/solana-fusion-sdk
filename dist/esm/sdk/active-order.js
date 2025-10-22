import { FusionOrder } from '../fusion-order';
import { Address } from '../domains';
export class ActiveOrder {
    creationTxSignature;
    maker;
    order;
    remainingMakerAmount;
    constructor(creationTxSignature, maker, order, remainingMakerAmount) {
        this.creationTxSignature = creationTxSignature;
        this.maker = maker;
        this.order = order;
        this.remainingMakerAmount = remainingMakerAmount;
    }
    static fromJSON(json) {
        return new ActiveOrder(json.txSignature, new Address(json.maker), FusionOrder.fromJSON(json.order), BigInt(json.remainingMakerAmount));
    }
}
//# sourceMappingURL=active-order.js.map