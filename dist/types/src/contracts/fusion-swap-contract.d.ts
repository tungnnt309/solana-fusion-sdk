import { TransactionInstruction } from './transaction-instruction';
import { FusionOrder } from '../fusion-order';
import { Address } from '../domains';
export declare class FusionSwapContract {
    readonly programId: Address;
    static ADDRESS: Address;
    private readonly coder;
    private readonly OPTIONAL_ACCOUNT_META;
    constructor(programId: Address);
    static default(): FusionSwapContract;
    create(order: FusionOrder, accounts: {
        maker: Address;
        srcTokenProgram: Address;
    }): TransactionInstruction;
    fill(order: FusionOrder, amount: bigint, accounts: {
        taker: Address;
        maker: Address;
        srcTokenProgram: Address;
        dstTokenProgram: Address;
        takerSrcAccount?: Address;
        whitelist?: Address;
    }): TransactionInstruction;
    /**
     * Returns cancel instruction which only maker can submit
     */
    cancelOwnOrder(order: FusionOrder, accounts: {
        maker: Address;
        srcTokenProgram: Address;
    }): TransactionInstruction;
    /**
     * Returns cancel instruction which only resolver with access token can submit
     */
    cancelOrderByResolver(order: FusionOrder, accounts: {
        maker: Address;
        resolver: Address;
        srcTokenProgram: Address;
        whitelist?: Address;
    }, 
    /**
     * If resolver wants to limit reward, he can pass here max reward in lamports
     */
    rewardLimit?: bigint | undefined): TransactionInstruction;
    private optional;
}
