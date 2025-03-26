import {
    EventType,
    OnOrderCancelledCb,
    OnOrderCb,
    OnOrderCreatedCb,
    OnOrderFilledCb,
    OrderEventType
} from './types'
import {WsProviderConnector} from './websocket-provider.connector'

export class ActiveOrdersWebSocketApi {
    public readonly provider!: WsProviderConnector

    constructor(provider: WsProviderConnector) {
        this.provider = provider
    }

    onOrder(cb: OnOrderCb): void {
        this.provider.onMessage((data: unknown) => {
            if (isOrderEvent(data)) {
                cb(data)
            }
        })
    }

    onOrderCreated(cb: OnOrderCreatedCb): void {
        this.provider.onMessage((data: unknown) => {
            if (isOrderEvent(data) && data.event === EventType.Create) {
                cb(data)
            }
        })
    }

    onOrderFilled(cb: OnOrderFilledCb): void {
        this.provider.onMessage((data: unknown) => {
            if (isOrderEvent(data) && data.event === EventType.Fill) {
                cb(data)
            }
        })
    }

    onOrderCancelled(cb: OnOrderCancelledCb): void {
        this.provider.onMessage((data: unknown) => {
            if (isOrderEvent(data) && data.event === EventType.Cancel) {
                cb(data)
            }
        })
    }
}

function isOrderEvent(data: unknown): data is OrderEventType {
    return (
        typeof data === 'object' &&
        data !== null &&
        'event' in data &&
        typeof data.event === 'string'
    )
}
