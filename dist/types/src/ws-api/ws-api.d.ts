import { RpcWebsocketApi } from './rpc-websocket-api';
import { ActiveOrdersWebSocketApi } from './active-websocket-orders-api';
import { AnyFunction, AnyFunctionWithThis, ErrorFunctionWithThis, OnMessageCb, WebSocketEvent, WsApiConfig } from './types';
import { WsProviderConnector } from './websocket-provider.connector';
export declare class WebSocketApi {
    private static Version;
    readonly rpc: RpcWebsocketApi;
    readonly order: ActiveOrdersWebSocketApi;
    readonly provider: WsProviderConnector;
    private constructor();
    static fromConfig(config: WsApiConfig): WebSocketApi;
    static fromProvider(provider: WsProviderConnector): WebSocketApi;
    init(): void;
    on(event: WebSocketEvent.Error, cb: ErrorFunctionWithThis): void;
    on(event: WebSocketEvent, cb: AnyFunctionWithThis): void;
    off(event: WebSocketEvent.Error, cb: ErrorFunctionWithThis): void;
    off(event: WebSocketEvent, cb: AnyFunctionWithThis): void;
    onOpen(cb: AnyFunctionWithThis): void;
    send<T>(message: T): void;
    close(): void;
    onMessage(cb: OnMessageCb): void;
    onClose(cb: AnyFunction): void;
    onError(cb: AnyFunction): void;
}
