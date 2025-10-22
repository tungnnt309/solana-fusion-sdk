"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatus = void 0;
const fusion_order_1 = require("../fusion-order");
const domains_1 = require("../domains");
const api_1 = require("../api");
class OrderStatus {
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
        return new OrderStatus(new domains_1.Address(json.maker), json.orderHash, json.status, fusion_order_1.FusionOrder.fromJSON(json.order), BigInt(json.approximateTakingAmount), json.cancelTx, json.expirationTime, json.fills.map((f) => ({
            txSignature: f.txSignature,
            filledMakerAmount: BigInt(f.filledMakerAmount),
            filledAuctionTakerAmount: BigInt(f.filledAuctionTakerAmount)
        })), json.createdAt, json.srcTokenPriceUsd, json.dstTokenPriceUsd, json.cancelable);
    }
    isActive() {
        return this.status === api_1.OrderStatus.inProgress;
    }
}
exports.OrderStatus = OrderStatus;
//# sourceMappingURL=order-status.js.map