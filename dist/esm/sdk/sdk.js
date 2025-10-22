import { Quote } from './quote';
import { OrderStatus } from './order-status';
import { CancellableOrder } from './cancellable-order';
import { ActiveOrder } from './active-order';
import { FusionOrder } from '../fusion-order';
import { Address } from '../domains';
import { OrdersApi, QuoterApi } from '../api';
export class Sdk {
    ordersApi;
    quoterApi;
    constructor(provider, apiConfig) {
        this.ordersApi = new OrdersApi(provider, apiConfig);
        this.quoterApi = new QuoterApi(provider, apiConfig);
    }
    async getQuote(srcToken, dstToken, amount, signer, slippage, enableEstimate) {
        const quoteRaw = await this.quoterApi.getQuote(srcToken, dstToken, amount, signer, typeof enableEstimate === "boolean" ? enableEstimate : false, slippage);
        return Quote.fromJSON(srcToken, dstToken, signer, quoteRaw);
    }
    async createOrder(srcToken, dstToken, amount, signer, slippage, preset) {
        const quote = await this.getQuote(srcToken, dstToken, amount, signer, slippage, true);
        return quote.toOrder(preset, undefined, quote);
    }
    async getOrderStatus(orderHash) {
        const orderStatus = await this.ordersApi.getOrderStatus(orderHash);
        return OrderStatus.fromJSON(orderStatus);
    }
    async getOrdersCancellableByResolver(page = 1, limit = 100) {
        const res = await this.ordersApi.getOrdersCancellableByResolver(page, limit);
        return {
            ...res,
            items: res.items.map((o) => new CancellableOrder(new Address(o.maker), FusionOrder.fromJSON(o.order)))
        };
    }
    async getActiveOrders(page = 1, limit = 100) {
        const res = await this.ordersApi.getActiveOrders(page, limit);
        return {
            ...res,
            items: res.items.map((o) => ActiveOrder.fromJSON(o))
        };
    }
}
//# sourceMappingURL=sdk.js.map