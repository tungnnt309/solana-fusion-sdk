import { FusionOrder } from '../fusion-order';
import { Address } from '../domains';
import { OrderStatus as Status } from '../api';
export class OrderStatus {
    maker;
    orderHash;
    status;
    order;
    approximateTakingAmount;
    cancelTx;
    expirationTime;
    fills;
    createdAt;
    srcTokenPriceUsd;
    dstTokenPriceUsd;
    cancelable;
    // eslint-disable-next-line max-params
    constructor(maker, orderHash, status, order, approximateTakingAmount, cancelTx, expirationTime, fills, createdAt, srcTokenPriceUsd, dstTokenPriceUsd, cancelable) {
        this.maker = maker;
        this.orderHash = orderHash;
        this.status = status;
        this.order = order;
        this.approximateTakingAmount = approximateTakingAmount;
        this.cancelTx = cancelTx;
        this.expirationTime = expirationTime;
        this.fills = fills;
        this.createdAt = createdAt;
        this.srcTokenPriceUsd = srcTokenPriceUsd;
        this.dstTokenPriceUsd = dstTokenPriceUsd;
        this.cancelable = cancelable;
    }
    static fromJSON(json) {
        return new OrderStatus(new Address(json.maker), json.orderHash, json.status, FusionOrder.fromJSON(json.order), BigInt(json.approximateTakingAmount), json.cancelTx, json.expirationTime, json.fills.map((f) => ({
            txSignature: f.txSignature,
            filledMakerAmount: BigInt(f.filledMakerAmount),
            filledAuctionTakerAmount: BigInt(f.filledAuctionTakerAmount)
        })), json.createdAt, json.srcTokenPriceUsd, json.dstTokenPriceUsd, json.cancelable);
    }
    isActive() {
        return this.status === Status.inProgress;
    }
}
//# sourceMappingURL=order-status.js.map