import axios from 'axios';
export class AxiosHttpProvider {
    async get(url, headers) {
        const res = await axios.get(url, { headers });
        return res.data;
    }
    async post(url, data, headers) {
        const res = await axios.post(url, data, { headers });
        return res.data;
    }
}
//# sourceMappingURL=http-provider.axios.js.map