import { Quote } from 'sdk';
import { Address } from '../domains';
export type OrderInfoData = {
    id: number;
    srcAmount: bigint;
    minDstAmount: bigint;
    estimatedDstAmount: bigint;
    receiver: Address;
    srcMint: Address;
    dstMint: Address;
    quote?: Quote;
};
