"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersApi = void 0;
class OrdersApi {
    httpClient;
    baseUrl;
    headers;
    constructor(httpClient, config) {
        this.httpClient = httpClient;
        this.baseUrl = `${config.baseUrl}/orders/${config.version}/501`;
        this.headers = config.authKey
            ? {
                Authorization: `Bearer ${config.authKey}`
            }
            : {};
    }
    async getActiveOrders(page = 1, limit = 100) {
        return this.httpClient.get(`${this.baseUrl}/order/active?limit=${limit}&page=${page}`, this.headers);
    }
    async getOrderStatus(orderHash) {
        return this.httpClient.get(`${this.baseUrl}/order/status/${orderHash}`, this.headers);
    }
    async getOrdersCancellableByResolver(page = 1, limit = 100) {
        return this.httpClient.get(`${this.baseUrl}/order/cancelable-by-resolvers?limit=${limit}&page=${page}`, this.headers);
    }
}
exports.OrdersApi = OrdersApi;
//# sourceMappingURL=orders-api.js.map