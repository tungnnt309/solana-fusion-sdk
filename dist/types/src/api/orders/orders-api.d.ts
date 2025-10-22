import { OrderCancellableByResolverInfoDTO, OrderInfoDTO, OrderStatusDTO } from './types';
import { ApiConfig, HttpProvider, Pagination } from '../types';
export declare class OrdersApi {
    private readonly httpClient;
    private readonly baseUrl;
    private readonly headers;
    constructor(httpClient: HttpProvider, config: ApiConfig);
    getActiveOrders(page?: number, limit?: number): Promise<Pagination<OrderInfoDTO>>;
    getOrderStatus(orderHash: string): Promise<OrderStatusDTO>;
    getOrdersCancellableByResolver(page?: number, limit?: number): Promise<Pagination<OrderCancellableByResolverInfoDTO>>;
}
