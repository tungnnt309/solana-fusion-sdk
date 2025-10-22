"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveOrder = void 0;
const fusion_order_1 = require("../fusion-order");
const domains_1 = require("../domains");
class ActiveOrder {
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
        return new ActiveOrder(json.txSignature, new domains_1.Address(json.maker), fusion_order_1.FusionOrder.fromJSON(json.order), BigInt(json.remainingMakerAmount));
    }
}
exports.ActiveOrder = ActiveOrder;
//# sourceMappingURL=active-order.js.map