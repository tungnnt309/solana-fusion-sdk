import {Address} from '../domains'

export type OrderInfoData = {
    id: number // u32
    srcAmount: bigint // u64
    minDstAmount: bigint // u64
    estimatedDstAmount: bigint // u64
    receiver: Address
    srcMint: Address
    dstMint: Address
}
