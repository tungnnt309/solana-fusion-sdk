"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatus = void 0;
var OrderStatus;
(function (OrderStatus) {
    OrderStatus[OrderStatus["inProgress"] = 0] = "inProgress";
    OrderStatus[OrderStatus["filled"] = 200] = "filled";
    OrderStatus[OrderStatus["cancelled"] = 301] = "cancelled";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
//# sourceMappingURL=types.js.map