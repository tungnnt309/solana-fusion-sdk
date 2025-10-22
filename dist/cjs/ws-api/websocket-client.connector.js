"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketClient = void 0;
const tslib_1 = require("tslib");
const ws_1 = tslib_1.__importDefault(require("ws"));
const websocket_provider_connector_1 = require("./websocket-provider.connector");
class WebsocketClient extends websocket_provider_connector_1.WsProviderConnector {
    ws;
    url;
    initialized;
    authKey;
    constructor(config) {
        super();
        this.url = config.url;
        this.authKey = config.authKey;
        const lazyInit = config.lazyInit || false;
        if (!lazyInit) {
            this.initialized = true;
            this.ws = new ws_1.default(this.url, this.authKey
                ? {
                    headers: {
                        Authorization: `Bearer ${this.authKey}`
                    }
                }
                : undefined);
            return;
        }
        this.initialized = false;
    }
    init() {
        if (this.initialized) {
            throw new Error('WebSocket is already initialized');
        }
        // @ts-expect-error hack for readonly property
        this.initialized = true;
        // @ts-expect-error hack for readonly property
        this.ws = new ws_1.default(this.url, this.authKey
            ? {
                headers: {
                    Authorization: `Bearer ${this.authKey}`
                }
            }
            : undefined);
    }
    on(event, cb) {
        this.checkInitialized();
        this.ws.on(event, cb);
    }
    off(event, cb) {
        this.checkInitialized();
        this.ws.off(event, cb);
    }
    onOpen(cb) {
        this.on('open', cb);
    }
    send(message) {
        this.checkInitialized();
        const serialized = JSON.stringify(message);
        this.ws.send(serialized);
    }
    onMessage(cb) {
        this.on('message', (data) => {
            if (data instanceof Uint8Array || typeof data === 'string') {
                const parsedData = JSON.parse(data.toString());
                cb(parsedData);
            }
            else {
                // eslint-disable-next-line no-console
                console.error('Unexpected message type:', data);
            }
        });
    }
    ping() {
        this.ws.ping();
    }
    onPong(cb) {
        this.on('pong', () => {
            cb();
        });
    }
    onClose(cb) {
        this.on('close', cb);
    }
    onError(cb) {
        this.on('error', cb);
    }
    close() {
        this.checkInitialized();
        this.ws.close();
    }
    checkInitialized() {
        if (!this.initialized) {
            throwInitError();
        }
    }
}
exports.WebsocketClient = WebsocketClient;
function throwInitError() {
    throw new Error('WebSocket is not initialized. Call init() first.');
}
//# sourceMappingURL=websocket-client.connector.js.map