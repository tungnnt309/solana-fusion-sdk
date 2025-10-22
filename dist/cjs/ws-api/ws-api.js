"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketApi = void 0;
const rpc_websocket_api_1 = require("./rpc-websocket-api");
const active_websocket_orders_api_1 = require("./active-websocket-orders-api");
const url_1 = require("./url");
const types_1 = require("./types");
const websocket_client_connector_1 = require("./websocket-client.connector");
class WebSocketApi {
    static Version = 'v1.0';
    rpc;
    order;
    provider;
    constructor(configOrProvider, isConfig) {
        if (isConfig) {
            const url = (0, url_1.castUrl)(configOrProvider.url);
            const urlWithNetwork = `${url}/${WebSocketApi.Version}/${types_1.NetworkEnum.SOLANA}`;
            const configWithUrl = { ...configOrProvider, url: urlWithNetwork };
            const provider = new websocket_client_connector_1.WebsocketClient(configWithUrl);
            this.provider = provider;
            this.rpc = new rpc_websocket_api_1.RpcWebsocketApi(provider);
            this.order = new active_websocket_orders_api_1.ActiveOrdersWebSocketApi(provider);
            return;
        }
        this.provider = configOrProvider;
        this.rpc = new rpc_websocket_api_1.RpcWebsocketApi(configOrProvider);
        this.order = new active_websocket_orders_api_1.ActiveOrdersWebSocketApi(configOrProvider);
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
exports.WebSocketApi = WebSocketApi;
//# sourceMappingURL=ws-api.js.map