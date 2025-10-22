import { RpcWebsocketApi } from './rpc-websocket-api';
import { ActiveOrdersWebSocketApi } from './active-websocket-orders-api';
import { castUrl } from './url';
import { NetworkEnum } from './types';
import { WebsocketClient } from './websocket-client.connector';
export class WebSocketApi {
    static Version = 'v1.0';
    rpc;
    order;
    provider;
    constructor(configOrProvider, isConfig) {
        if (isConfig) {
            const url = castUrl(configOrProvider.url);
            const urlWithNetwork = `${url}/${WebSocketApi.Version}/${NetworkEnum.SOLANA}`;
            const configWithUrl = { ...configOrProvider, url: urlWithNetwork };
            const provider = new WebsocketClient(configWithUrl);
            this.provider = provider;
            this.rpc = new RpcWebsocketApi(provider);
            this.order = new ActiveOrdersWebSocketApi(provider);
            return;
        }
        this.provider = configOrProvider;
        this.rpc = new RpcWebsocketApi(configOrProvider);
        this.order = new ActiveOrdersWebSocketApi(configOrProvider);
    }
    static fromConfig(config) {
        return new WebSocketApi(config, true);
    }
    static fromProvider(provider) {
        return new WebSocketApi(provider, false);
    }
    init() {
        this.provider.init();
    }
    on(event, cb) {
        this.provider.on(event, cb);
    }
    off(event, cb) {
        this.provider.off(event, cb);
    }
    onOpen(cb) {
        this.provider.onOpen(cb);
    }
    send(message) {
        this.provider.send(message);
    }
    close() {
        this.provider.close();
    }
    onMessage(cb) {
        this.provider.onMessage(cb);
    }
    onClose(cb) {
        this.provider.onClose(cb);
    }
    onError(cb) {
        this.provider.onError(cb);
    }
}
//# sourceMappingURL=ws-api.js.map