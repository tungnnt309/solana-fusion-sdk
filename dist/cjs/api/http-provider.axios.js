"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AxiosHttpProvider = void 0;
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
class AxiosHttpProvider {
    async get(url, headers) {
        const res = await axios_1.default.get(url, { headers });
        return res.data;
    }
    async post(url, data, headers) {
        const res = await axios_1.default.post(url, data, { headers });
        return res.data;
    }
}
exports.AxiosHttpProvider = AxiosHttpProvider;
//# sourceMappingURL=http-provider.axios.js.map