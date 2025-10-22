import { Quote } from './quote';
import { OrderStatus } from './order-status';
import { CancellableOrder } from './cancellable-order';
import { ActiveOrder } from './active-order';
import { FusionOrder } from '../fusion-order';
import { Address, Bps } from '../domains';
import { ApiConfig, HttpProvider, Pagination, PresetType } from '../api';
export declare class Sdk {
    private readonly ordersApi;
    private readonly quoterApi;
    constructor(provider: HttpProvider, apiConfig: ApiConfig);
    getQuote(srcToken: Address, dstToken: Address, amount: bigint, signer: Address, slippage?: Bps, enableEstimate?: boolean): Promise<Quote>;
    createOrder(srcToken: Address, dstToken: Address, amount: bigint, signer: Address, slippage?: Bps, preset?: PresetType): Promise<FusionOrder>;
    getOrderStatus(orderHash: string): Promise<OrderStatus>;
    getOrdersCancellableByResolver(page?: number, limit?: number): Promise<Pagination<CancellableOrder>>;
    getActiveOrders(page?: number, limit?: number): Promise<Pagination<ActiveOrder>>;
}
