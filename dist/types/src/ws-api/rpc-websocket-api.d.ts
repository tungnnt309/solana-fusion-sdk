import { OnGetActiveOrdersCb, OnGetAllowedMethodsCb, OnPongCb, PaginationParams } from './types';
import { WsProviderConnector } from './websocket-provider.connector';
export declare class RpcWebsocketApi {
    readonly provider: WsProviderConnector;
    constructor(provider: WsProviderConnector);
    onPong(cb: OnPongCb): void;
    ping(): void;
    getActiveOrders({ limit, page }?: PaginationParams): void;
    onGetActiveOrders(cb: OnGetActiveOrdersCb): void;
    getAllowedMethods(): void;
    onGetAllowedMethods(cb: OnGetAllowedMethodsCb): void;
}
