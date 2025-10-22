export var RpcMethod;
(function (RpcMethod) {
    RpcMethod["GetAllowedMethods"] = "getAllowedMethods";
    RpcMethod["GetActiveOrders"] = "getActiveOrders";
    RpcMethod["Ping"] = "ping";
})(RpcMethod || (RpcMethod = {}));
export var EventType;
(function (EventType) {
    EventType["Create"] = "create";
    EventType["Fill"] = "fill";
    EventType["Cancel"] = "cancel";
})(EventType || (EventType = {}));
export var WebSocketEvent;
(function (WebSocketEvent) {
    WebSocketEvent["Close"] = "close";
    WebSocketEvent["Error"] = "error";
    WebSocketEvent["Message"] = "message";
    WebSocketEvent["Open"] = "open";
})(WebSocketEvent || (WebSocketEvent = {}));
export class PaginationRequest {
    page;
    limit;
    constructor(page, limit) {
        this.page = page;
        this.limit = limit;
        this.validate();
    }
    validate() {
        if (this.limit != null && (this.limit < 1 || this.limit > 500)) {
            throw new Error('limit should be in range between 1 and 500');
        }
        if (this.page != null && this.page < 1) {
            throw new Error(`page should be >= 1`);
        }
    }
}
export var NetworkEnum;
(function (NetworkEnum) {
    NetworkEnum[NetworkEnum["SOLANA"] = 501] = "SOLANA";
})(NetworkEnum || (NetworkEnum = {}));
//# sourceMappingURL=types.js.map