"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sdk = void 0;
const quote_1 = require("./quote");
const order_status_1 = require("./order-status");
const cancellable_order_1 = require("./cancellable-order");
const active_order_1 = require("./active-order");
const fusion_order_1 = require("../fusion-order");
const domains_1 = require("../domains");
const api_1 = require("../api");
class Sdk {
    ordersApi;
    quoterApi;
    constructor(provider, apiConfig) {
        this.ordersApi = new api_1.OrdersApi(provider, apiConfig);
        this.quoterApi = new api_1.QuoterApi(provider, apiConfig);
    }
    async getQuote(srcToken, dstToken, amount, signer, slippage, enableEstimate) {
        const quoteRaw = await this.quoterApi.getQuote(srcToken, dstToken, amount, signer, typeof enableEstimate === "boolean" ? enableEstimate : false, slippage);
        return quote_1.Quote.fromJSON(srcToken, dstToken, signer, quoteRaw);
    }
    async createOrder(srcToken, dstToken, amount, signer, slippage, preset) {
        const quote = await this.getQuote(srcToken, dstToken, amount, signer, slippage, true);
        return quote.toOrder(preset, undefined, quote);
    }
    async getOrderStatus(orderHash) {
        const orderStatus = await this.ordersApi.getOrderStatus(orderHash);
        return order_status_1.OrderStatus.fromJSON(orderStatus);
    }
    async getOrdersCancellableByResolver(page = 1, limit = 100) {
        const res = await this.ordersApi.getOrdersCancellableByResolver(page, limit);
        return {
            ...res,
            items: res.items.map((o) => new cancellable_order_1.CancellableOrder(new domains_1.Address(o.maker), fusion_order_1.FusionOrder.fromJSON(o.order)))
        };
    }
    async getActiveOrders(page = 1, limit = 100) {
        const res = await this.ordersApi.getActiveOrders(page, limit);
        return {
            ...res,
            items: res.items.map((o) => active_order_1.ActiveOrder.fromJSON(o))
        };
    }
}
exports.Sdk = Sdk;
//# sourceMappingURL=sdk.js.map