"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RpcWebsocketApi = void 0;
const types_1 = require("./types");
class RpcWebsocketApi {
    provider;
    constructor(provider) {
        this.provider = provider;
    }
    onPong(cb) {
        this.provider.onPong(() => {
            cb();
        });
    }
    ping() {
        this.provider.ping();
    }
    getActiveOrders({ limit, page } = {}) {
        const paginationRequest = new types_1.PaginationRequest(page, limit);
        this.provider.send({
            method: types_1.RpcMethod.GetActiveOrders,
            param: paginationRequest
        });
    }
    onGetActiveOrders(cb) {
        this.provider.onMessage((data) => {
            if (isRpcEvent(data) && data.method === types_1.RpcMethod.GetActiveOrders) {
                cb(data.result);
            }
        });
    }
    getAllowedMethods() {
        this.provider.send({ method: types_1.RpcMethod.GetAllowedMethods });
    }
    onGetAllowedMethods(cb) {
        this.provider.onMessage((data) => {
            if (isRpcEvent(data) &&
                data.method === types_1.RpcMethod.GetAllowedMethods) {
                cb(data.result);
            }
        });
    }
}
exports.RpcWebsocketApi = RpcWebsocketApi;
function isRpcEvent(data) {
    return (typeof data === 'object' &&
        data !== null &&
        'method' in data &&
        'result' in data);
}
//# sourceMappingURL=rpc-websocket-api.js.map