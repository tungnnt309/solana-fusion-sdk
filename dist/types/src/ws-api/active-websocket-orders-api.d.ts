import { OnOrderCancelledCb, OnOrderCb, OnOrderCreatedCb, OnOrderFilledCb } from './types';
import { WsProviderConnector } from './websocket-provider.connector';
export declare class ActiveOrdersWebSocketApi {
    readonly provider: WsProviderConnector;
    constructor(provider: WsProviderConnector);
    onOrder(cb: OnOrderCb): void;
    onOrderCreated(cb: OnOrderCreatedCb): void;
    onOrderFilled(cb: OnOrderFilledCb): void;
    onOrderCancelled(cb: OnOrderCancelledCb): void;
}
