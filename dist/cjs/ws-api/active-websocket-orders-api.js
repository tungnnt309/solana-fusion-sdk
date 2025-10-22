"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveOrdersWebSocketApi = void 0;
const types_1 = require("./types");
class ActiveOrdersWebSocketApi {
    provider;
    constructor(provider) {
        this.provider = provider;
    }
    onOrder(cb) {
        this.provider.onMessage((data) => {
            if (isOrderEvent(data)) {
                cb(data);
            }
        });
    }
    onOrderCreated(cb) {
        this.provider.onMessage((data) => {
            if (isOrderEvent(data) && data.event === types_1.EventType.Create) {
                cb(data);
            }
        });
    }
    onOrderFilled(cb) {
        this.provider.onMessage((data) => {
            if (isOrderEvent(data) && data.event === types_1.EventType.Fill) {
                cb(data);
            }
        });
    }
    onOrderCancelled(cb) {
        this.provider.onMessage((data) => {
            if (isOrderEvent(data) && data.event === types_1.EventType.Cancel) {
                cb(data);
            }
        });
    }
}
exports.ActiveOrdersWebSocketApi = ActiveOrdersWebSocketApi;
function isOrderEvent(data) {
    return (typeof data === 'object' &&
        data !== null &&
        'event' in data &&
        typeof data.event === 'string');
}
//# sourceMappingURL=active-websocket-orders-api.js.map