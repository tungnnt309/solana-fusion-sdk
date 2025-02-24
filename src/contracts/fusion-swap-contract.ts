import {BorshCoder} from '@coral-xyz/anchor'
import {TransactionInstruction} from './transaction-instruction'
import {getAta} from '../utils/addresses/ata'
import {FusionOrder} from '../fusion-order'
import {Address} from '../domains'
import {IDL} from '../idl/fusion-swap'
import {getPda} from '../utils/addresses/pda'

export class FusionSwapContract {
    static ADDRESS = new Address('9hbsrgqQUYBPdAiriyn5A7cr3zBzN3EmeXN6mJLyizHh')

    private readonly coder = new BorshCoder(IDL)

    constructor(public readonly programId: Address) {}

    static default(): FusionSwapContract {
        return new FusionSwapContract(FusionSwapContract.ADDRESS)
    }

    public create(
        order: FusionOrder,
        accounts: {
            maker: Address
            srcTokenProgram: Address
        }
    ): TransactionInstruction {
        const escrow = getPda(this.programId, [
            new TextEncoder().encode('escrow'),
            accounts.maker.toBuffer(),
            order.getOrderHash()
        ])


        return new TransactionInstruction(
            this.programId,
            [
                {
                    // maker
                    pubkey: accounts.maker,
                    isSigner: true,
                    isWritable: true
                },
                {
                    // src_mint
                    pubkey: order.srcMint,
                    isWritable: false,
                    isSigner: false
                },
                {
                    // dst_mint
                    pubkey: order.dstMint,
                    isWritable: false,
                    isSigner: false
                },
                {
                    // maker_src_ata
                    pubkey: getAta(
                        accounts.maker,
                        order.srcMint,
                        accounts.srcTokenProgram
                    ),
                    isWritable: true,
                    isSigner: false
                },
                {
                    // maker_receiver
                    pubkey: order.receiver,
                    isWritable: false,
                    isSigner: false
                },
                {
                    // escrow
                    pubkey: escrow,
                    isWritable: false,
                    isSigner: false
                },
                {
                    // escrow_src_ata
                    pubkey: getAta(
                        escrow,
                        order.srcMint,
                        accounts.srcTokenProgram
                    ),
                    isWritable: true,
                    isSigner: false
                },
                {
                    // protocol_dst_ata
                    pubkey: this.optional(order.fees?.protocolDstAta),
                    isWritable: false,
                    isSigner: false
                },
                {
                    // integrator_dst_ata
                    pubkey: this.optional(order.fees?.integratorDstAta),
                    isWritable: false,
                    isSigner: false
                },
                {
                    // associated_token_program
                    pubkey: Address.ASSOCIATED_TOKE_PROGRAM_ID,
                    isWritable: false,
                    isSigner: false
                },
                {
                    // src_token_program
                    pubkey: accounts.srcTokenProgram,
                    isWritable: false,
                    isSigner: false
                },
                {
                    // system_program
                    pubkey: Address.SYSTEM_PROGRAM_ID,
                    isWritable: false,
                    isSigner: false
                }
            ],
            this.coder.instruction.encode('create', {
                order: order.asReduced()
            })
        )
    }

    private optional(acc: Address | undefined | null): Address {
        return acc ? acc : this.programId
    }
}
