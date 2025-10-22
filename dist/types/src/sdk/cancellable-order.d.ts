import { Address } from '../domains';
import { FusionOrder } from '../fusion-order';
export declare class CancellableOrder {
    readonly maker: Address;
    readonly order: FusionOrder;
    constructor(maker: Address, order: FusionOrder);
}
