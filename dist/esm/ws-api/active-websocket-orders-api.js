import { EventType } from './types';
export class ActiveOrdersWebSocketApi {
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
            if (isOrderEvent(data) && data.event === EventType.Create) {
                cb(data);
            }
        });
    }
    onOrderFilled(cb) {
        this.provider.onMessage((data) => {
            if (isOrderEvent(data) && data.event === EventType.Fill) {
                cb(data);
            }
        });
    }
    onOrderCancelled(cb) {
        this.provider.onMessage((data) => {
            if (isOrderEvent(data) && data.event === EventType.Cancel) {
                cb(data);
            }
        });
    }
}
function isOrderEvent(data) {
    return (typeof data === 'object' &&
        data !== null &&
        'event' in data &&
        typeof data.event === 'string');
}
//# sourceMappingURL=active-websocket-orders-api.js.map