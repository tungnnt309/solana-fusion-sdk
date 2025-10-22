import { FusionOrder } from '../fusion-order';
import { Address } from '../domains';
import { OrderStatusDTO, OrderStatus as Status } from '../api';
export declare class OrderStatus {
    readonly maker: Address;
    readonly orderHash: string;
    readonly status: Status;
    readonly order: FusionOrder;
    readonly approximateTakingAmount: bigint;
    readonly cancelTx: string | undefined;
    readonly expirationTime: number;
    readonly fills: Array<{
        txSignature: string;
        filledMakerAmount: bigint;
        filledAuctionTakerAmount: bigint;
    }>;
    readonly createdAt: number;
    readonly srcTokenPriceUsd: number;
    readonly dstTokenPriceUsd: number;
    readonly cancelable: boolean;
    constructor(maker: Address, orderHash: string, status: Status, order: FusionOrder, approximateTakingAmount: bigint, cancelTx: string | undefined, expirationTime: number, fills: Array<{
        txSignature: string;
        filledMakerAmount: bigint;
        filledAuctionTakerAmount: bigint;
    }>, createdAt: number, srcTokenPriceUsd: number, dstTokenPriceUsd: number, cancelable: boolean);
    static fromJSON(json: OrderStatusDTO): OrderStatus;
    isActive(): boolean;
}
