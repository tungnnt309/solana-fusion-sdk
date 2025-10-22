import { PaginationRequest, RpcMethod } from './types';
export class RpcWebsocketApi {
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
        const paginationRequest = new PaginationRequest(page, limit);
        this.provider.send({
            method: RpcMethod.GetActiveOrders,
            param: paginationRequest
        });
    }
    onGetActiveOrders(cb) {
        this.provider.onMessage((data) => {
            if (isRpcEvent(data) && data.method === RpcMethod.GetActiveOrders) {
                cb(data.result);
            }
        });
    }
    getAllowedMethods() {
        this.provider.send({ method: RpcMethod.GetAllowedMethods });
    }
    onGetAllowedMethods(cb) {
        this.provider.onMessage((data) => {
            if (isRpcEvent(data) &&
                data.method === RpcMethod.GetAllowedMethods) {
                cb(data.result);
            }
        });
    }
}
function isRpcEvent(data) {
    return (typeof data === 'object' &&
        data !== null &&
        'method' in data &&
        'result' in data);
}
//# sourceMappingURL=rpc-websocket-api.js.map