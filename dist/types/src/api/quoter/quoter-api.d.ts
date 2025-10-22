import { QuoteDTO } from './types';
import { ApiConfig, HttpProvider } from '../types';
import { Address, Bps } from '../../domains';
export declare class QuoterApi {
    private readonly httpClient;
    private readonly baseUrl;
    private readonly headers;
    constructor(httpClient: HttpProvider, config: ApiConfig);
    getQuote(srcToken: Address, dstToken: Address, amount: bigint, signer: Address, 
    /**
     * if enabled then generates quoteId
     */
    enableEstimate: boolean, slippage?: Bps): Promise<QuoteDTO>;
}
