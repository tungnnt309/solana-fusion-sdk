import { OrderInfoDTO } from '../api';
import { FusionOrder } from '../fusion-order';
import { Address } from '../domains';
export declare class ActiveOrder {
    readonly creationTxSignature: string;
    readonly maker: Address;
    readonly order: FusionOrder;
    readonly remainingMakerAmount: bigint;
    constructor(creationTxSignature: string, maker: Address, order: FusionOrder, remainingMakerAmount: bigint);
    static fromJSON(json: OrderInfoDTO): ActiveOrder;
}
