import {ProgramTestContext, start} from 'solana-bankrun'
import {Keypair, PublicKey, Transaction} from '@solana/web3.js'
import {BorshCoder} from '@coral-xyz/anchor'
import {
    createMint,
    getOrCreateAssociatedTokenAccount,
    mintTo,
    TOKEN_PROGRAM_ID
} from '@solana/spl-token'
import {
    airdropAccount,
    sol,
    SYSTEM_PROGRAM_ID,
    withBalanceChanges
} from '../utils'
import {IDL as WhitelistIDL} from '../../src/idl/whitelist'
import {getPda} from '../../src/utils/addresses/pda'
import {TestConnection} from '../test-connection'
import {
    Address,
    AuctionDetails,
    FusionOrder,
    FusionSwapContract
} from '../../src'
import {id} from '../../src/utils/id'
import {now} from '../../src/utils/time/now'
import {getAta} from '../../src/utils/addresses/ata'

describe('FusionSwap', () => {
    const srcToken = Keypair.generate()
    const dstToken = Keypair.generate()
    const maker = Keypair.generate()
    const taker = Keypair.generate()
    const owner = Keypair.generate()
    const whitelistProgramId = new PublicKey(
        'BiZpdYaUvYa6DLn5Hc769UtmEuoCEbEmt314TFQXtc6k'
    )
    const fusionSwapProgramId = new PublicKey(
        '9hbsrgqQUYBPdAiriyn5A7cr3zBzN3EmeXN6mJLyizHh'
    )

    let programTestCtx: ProgramTestContext

    beforeEach(async () => {
        programTestCtx = await start(
            [
                {
                    name: 'whitelist',
                    programId: whitelistProgramId
                },
                {
                    name: 'fusion_swap',
                    programId: fusionSwapProgramId
                }
            ],
            [
                airdropAccount(maker.publicKey, sol(100)),
                airdropAccount(taker.publicKey, sol(100)),
                airdropAccount(owner.publicKey, sol(100))
            ]
        )

        await initWhitelist(
            programTestCtx,
            whitelistProgramId,
            owner,
            taker.publicKey
        )

        await initTokens(programTestCtx, owner, [
            {
                mint: srcToken,
                owners: [
                    {
                        address: maker.publicKey,
                        amount: sol(100)
                    }
                ]
            },
            {
                mint: dstToken,
                owners: [
                    {
                        address: taker.publicKey,
                        amount: sol(100)
                    }
                ]
            }
        ])
    })

    it('should create order', async () => {
        const order = new FusionOrder(
            {
                srcMint: Address.fromPublicKey(srcToken.publicKey),
                dstMint: Address.fromPublicKey(dstToken.publicKey),
                srcAmount: BigInt(sol(0.1)),
                minDstAmount: BigInt(sol(0.02)),
                estimatedDstAmount: BigInt(sol(0.02)),
                id: id(),
                receiver: Address.fromPublicKey(maker.publicKey)
            },
            AuctionDetails.noAuction(now(), 180)
        )

        const contract = FusionSwapContract.default()

        const ix = contract.create(order, {
            maker: Address.fromPublicKey(maker.publicKey),
            srcTokenProgram: Address.fromPublicKey(TOKEN_PROGRAM_ID)
        })

        const tx = new Transaction().add({
            ...ix,
            programId: new PublicKey(ix.programId.toBuffer()),
            keys: ix.accounts.map((a) => ({
                ...a,
                pubkey: new PublicKey(a.pubkey.toBuffer())
            }))
        })

        tx.recentBlockhash = programTestCtx.lastBlockhash
        tx.sign(maker)

        const [makerDiff, escrowDiff] = await withBalanceChanges(
            programTestCtx,
            () => programTestCtx.banksClient.processTransaction(tx),
            [
                getAta(
                    maker.publicKey,
                    srcToken.publicKey,
                    Address.TOKEN_PROGRAM_ID
                ),
                order.getEscrow(maker.publicKey)
            ]
        )

        expect(makerDiff).toEqual(-order.srcAmount)
        expect(escrowDiff).toEqual(order.srcAmount)
    })
})

async function initWhitelist(
    testCtx: ProgramTestContext,
    programId: PublicKey,
    owner: Keypair,
    resolver: PublicKey
): Promise<void> {
    const whitelistCoder = new BorshCoder(WhitelistIDL)

    // region init
    const initTx = new Transaction({
        feePayer: owner.publicKey,
        recentBlockhash: testCtx.lastBlockhash
    }).add({
        keys: [
            {pubkey: owner.publicKey, isSigner: true, isWritable: false},
            {
                pubkey: new PublicKey(
                    getPda(programId, [
                        new TextEncoder().encode('whitelist_state')
                    ]).toBuffer()
                ),
                isSigner: false,
                isWritable: true
            },
            {
                pubkey: SYSTEM_PROGRAM_ID,
                isSigner: false,
                isWritable: false
            }
        ],
        data: whitelistCoder.instruction.encode('initialize', {}),
        programId: programId
    })

    initTx.sign(owner)
    await testCtx.banksClient.processTransaction(initTx)
    // endregion init
    // region register
    const registerTx = new Transaction({
        feePayer: owner.publicKey,
        recentBlockhash: testCtx.lastBlockhash
    }).add({
        keys: [
            {pubkey: owner.publicKey, isSigner: true, isWritable: false},
            {
                pubkey: new PublicKey(
                    getPda(programId, [
                        new TextEncoder().encode('whitelist_state')
                    ]).toBuffer()
                ),
                isSigner: false,
                isWritable: true
            },
            {
                pubkey: new PublicKey(
                    getPda(programId, [
                        new TextEncoder().encode('resolver_access'),
                        resolver.toBuffer()
                    ]).toBuffer()
                ),
                isSigner: false,
                isWritable: true
            },
            {
                pubkey: SYSTEM_PROGRAM_ID,
                isSigner: false,
                isWritable: false
            }
        ],
        data: whitelistCoder.instruction.encode('register', {user: resolver}),
        programId: programId
    })

    registerTx.sign(owner)
    await testCtx.banksClient.processTransaction(registerTx)
    // endregion register
}

async function initTokens(
    testCtx: ProgramTestContext,
    owner: Keypair,
    tokens: {
        mint: Keypair
        tokenProgram?: PublicKey
        owners: {address: PublicKey; amount: number}[]
    }[]
): Promise<void> {
    const connection = TestConnection.new(testCtx)

    for (const token of tokens) {
        await createMint(
            connection,
            owner,
            owner.publicKey,
            owner.publicKey,
            9,
            token.mint,
            undefined,
            token.tokenProgram
        )

        for (const user of token.owners) {
            const ata = await getOrCreateAssociatedTokenAccount(
                connection,
                owner,
                token.mint.publicKey,
                user.address,
                false,
                undefined,
                undefined,
                token.tokenProgram
            )

            await mintTo(
                connection,
                owner,
                token.mint.publicKey,
                ata.address,
                owner,
                user.amount,
                undefined,
                undefined,
                token.tokenProgram
            )
        }
    }
}
