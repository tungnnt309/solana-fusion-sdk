export class QuoterApi {
    httpClient;
    baseUrl;
    headers;
    constructor(httpClient, config) {
        this.httpClient = httpClient;
        this.baseUrl = `${config.baseUrl}/quoter/${config.version}/501`;
        this.headers = config.authKey
            ? {
                Authorization: `Bearer ${config.authKey}`
            }
            : {};
    }
    async getQuote(srcToken, dstToken, amount, signer, 
    /**
     * if enabled then generates quoteId
     */
    enableEstimate, slippage) {
        const params = new URLSearchParams({
            srcToken: srcToken.toString(),
            dstToken: dstToken.toString(),
            amount: amount.toString(),
            wallet: signer.toString(),
            enableEstimate: enableEstimate.toString()
        });
        if (slippage) {
            params.append('slippage', slippage.toPercent().toString());
        }
        return this.httpClient.get(`${this.baseUrl}/quote?${params}`, this.headers);
    }
}
//# sourceMappingURL=quoter-api.js.map