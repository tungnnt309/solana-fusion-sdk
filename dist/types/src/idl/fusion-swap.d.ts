import { WritableDeep } from 'type-fest';
declare const _IDL: {
    readonly address: "HNarfxC3kYMMhFkxUFeYb8wHVdPzY5t9pupqW5fL2meM";
    readonly metadata: {
        readonly name: "fusionSwap";
        readonly version: "0.1.0";
        readonly spec: "0.1.0";
        readonly description: "Created with Anchor";
    };
    readonly instructions: readonly [{
        readonly name: "cancel";
        readonly discriminator: readonly [232, 219, 223, 41, 219, 236, 220, 190];
        readonly accounts: readonly [{
            readonly name: "maker";
            readonly docs: readonly ["Account that created the escrow"];
            readonly writable: true;
            readonly signer: true;
        }, {
            readonly name: "srcMint";
            readonly docs: readonly ["Maker asset"];
        }, {
            readonly name: "escrow";
            readonly docs: readonly ["PDA derived from order details, acting as the authority for the escrow ATA"];
            readonly pda: {
                readonly seeds: readonly [{
                    readonly kind: "const";
                    readonly value: readonly [101, 115, 99, 114, 111, 119];
                }, {
                    readonly kind: "account";
                    readonly path: "maker";
                }, {
                    readonly kind: "arg";
                    readonly path: "orderHash";
                }];
            };
        }, {
            readonly name: "escrowSrcAta";
            readonly docs: readonly ["ATA of src_mint to store escrowed tokens"];
            readonly writable: true;
            readonly pda: {
                readonly seeds: readonly [{
                    readonly kind: "account";
                    readonly path: "escrow";
                }, {
                    readonly kind: "account";
                    readonly path: "srcTokenProgram";
                }, {
                    readonly kind: "account";
                    readonly path: "srcMint";
                }];
                readonly program: {
                    readonly kind: "const";
                    readonly value: readonly [140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142, 13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216, 219, 233, 248, 89];
                };
            };
        }, {
            readonly name: "makerSrcAta";
            readonly docs: readonly ["Maker's ATA of src_mint"];
            readonly writable: true;
            readonly optional: true;
            readonly pda: {
                readonly seeds: readonly [{
                    readonly kind: "account";
                    readonly path: "maker";
                }, {
                    readonly kind: "account";
                    readonly path: "srcTokenProgram";
                }, {
                    readonly kind: "account";
                    readonly path: "srcMint";
                }];
                readonly program: {
                    readonly kind: "const";
                    readonly value: readonly [140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142, 13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216, 219, 233, 248, 89];
                };
            };
        }, {
            readonly name: "srcTokenProgram";
        }];
        readonly args: readonly [{
            readonly name: "orderHash";
            readonly type: {
                readonly array: readonly ["u8", 32];
            };
        }, {
            readonly name: "orderSrcAssetIsNative";
            readonly type: "bool";
        }];
    }, {
        readonly name: "cancelByResolver";
        readonly discriminator: readonly [229, 180, 171, 131, 171, 6, 60, 191];
        readonly accounts: readonly [{
            readonly name: "resolver";
            readonly docs: readonly ["Account that cancels the escrow"];
            readonly writable: true;
            readonly signer: true;
        }, {
            readonly name: "resolverAccess";
            readonly docs: readonly ["Account allowed to cancel the order"];
            readonly pda: {
                readonly seeds: readonly [{
                    readonly kind: "const";
                    readonly value: readonly [114, 101, 115, 111, 108, 118, 101, 114, 95, 97, 99, 99, 101, 115, 115];
                }, {
                    readonly kind: "account";
                    readonly path: "resolver";
                }];
                readonly program: {
                    readonly kind: "const";
                    readonly value: readonly [70, 114, 58, 183, 136, 135, 252, 146, 80, 123, 72, 5, 135, 248, 186, 224, 25, 166, 101, 165, 0, 26, 153, 232, 9, 37, 218, 240, 178, 106, 153, 93];
                };
            };
        }, {
            readonly name: "maker";
            readonly writable: true;
        }, {
            readonly name: "makerReceiver";
        }, {
            readonly name: "srcMint";
            readonly docs: readonly ["Maker asset"];
        }, {
            readonly name: "dstMint";
            readonly docs: readonly ["Taker asset"];
        }, {
            readonly name: "escrow";
            readonly docs: readonly ["PDA derived from order details, acting as the authority for the escrow ATA"];
        }, {
            readonly name: "escrowSrcAta";
            readonly docs: readonly ["ATA of src_mint to store escrowed tokens"];
            readonly writable: true;
            readonly pda: {
                readonly seeds: readonly [{
                    readonly kind: "account";
                    readonly path: "escrow";
                }, {
                    readonly kind: "account";
                    readonly path: "srcTokenProgram";
                }, {
                    readonly kind: "account";
                    readonly path: "srcMint";
                }];
                readonly program: {
                    readonly kind: "const";
                    readonly value: readonly [140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142, 13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216, 219, 233, 248, 89];
                };
            };
        }, {
            readonly name: "makerSrcAta";
            readonly docs: readonly ["Maker's ATA of src_mint"];
            readonly writable: true;
            readonly optional: true;
            readonly pda: {
                readonly seeds: readonly [{
                    readonly kind: "account";
                    readonly path: "maker";
                }, {
                    readonly kind: "account";
                    readonly path: "srcTokenProgram";
                }, {
                    readonly kind: "account";
                    readonly path: "srcMint";
                }];
                readonly program: {
                    readonly kind: "const";
                    readonly value: readonly [140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142, 13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216, 219, 233, 248, 89];
                };
            };
        }, {
            readonly name: "srcTokenProgram";
        }, {
            readonly name: "systemProgram";
            readonly address: "11111111111111111111111111111111";
        }, {
            readonly name: "protocolDstAcc";
            readonly optional: true;
        }, {
            readonly name: "integratorDstAcc";
            readonly optional: true;
        }];
        readonly args: readonly [{
            readonly name: "order";
            readonly type: {
                readonly defined: {
                    readonly name: "orderConfig";
                };
            };
        }, {
            readonly name: "rewardLimit";
            readonly type: "u64";
        }];
    }, {
        readonly name: "create";
        readonly discriminator: readonly [24, 30, 200, 40, 5, 28, 7, 119];
        readonly accounts: readonly [{
            readonly name: "systemProgram";
            readonly address: "11111111111111111111111111111111";
        }, {
            readonly name: "escrow";
            readonly docs: readonly ["PDA derived from order details, acting as the authority for the escrow ATA"];
        }, {
            readonly name: "srcMint";
            readonly docs: readonly ["Source asset"];
        }, {
            readonly name: "srcTokenProgram";
        }, {
            readonly name: "escrowSrcAta";
            readonly docs: readonly ["ATA of src_mint to store escrowed tokens"];
            readonly writable: true;
            readonly pda: {
                readonly seeds: readonly [{
                    readonly kind: "account";
                    readonly path: "escrow";
                }, {
                    readonly kind: "account";
                    readonly path: "srcTokenProgram";
                }, {
                    readonly kind: "account";
                    readonly path: "srcMint";
                }];
                readonly program: {
                    readonly kind: "const";
                    readonly value: readonly [140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142, 13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216, 219, 233, 248, 89];
                };
            };
        }, {
            readonly name: "maker";
            readonly docs: readonly ["`maker`, who is willing to sell src token for dst token"];
            readonly writable: true;
            readonly signer: true;
        }, {
            readonly name: "makerSrcAta";
            readonly docs: readonly ["Maker's ATA of src_mint"];
            readonly writable: true;
            readonly optional: true;
            readonly pda: {
                readonly seeds: readonly [{
                    readonly kind: "account";
                    readonly path: "maker";
                }, {
                    readonly kind: "account";
                    readonly path: "srcTokenProgram";
                }, {
                    readonly kind: "account";
                    readonly path: "srcMint";
                }];
                readonly program: {
                    readonly kind: "const";
                    readonly value: readonly [140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142, 13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216, 219, 233, 248, 89];
                };
            };
        }, {
            readonly name: "dstMint";
            readonly docs: readonly ["Destination asset"];
        }, {
            readonly name: "makerReceiver";
        }, {
            readonly name: "associatedTokenProgram";
            readonly address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
        }, {
            readonly name: "protocolDstAcc";
            readonly optional: true;
        }, {
            readonly name: "integratorDstAcc";
            readonly optional: true;
        }];
        readonly args: readonly [{
            readonly name: "order";
            readonly type: {
                readonly defined: {
                    readonly name: "orderConfig";
                };
            };
        }];
    }, {
        readonly name: "fill";
        readonly discriminator: readonly [168, 96, 183, 163, 92, 10, 40, 160];
        readonly accounts: readonly [{
            readonly name: "taker";
            readonly docs: readonly ["`taker`, who buys `src_mint` for `dst_mint`"];
            readonly writable: true;
            readonly signer: true;
        }, {
            readonly name: "resolverAccess";
            readonly docs: readonly ["Account allowed to fill the order"];
            readonly pda: {
                readonly seeds: readonly [{
                    readonly kind: "const";
                    readonly value: readonly [114, 101, 115, 111, 108, 118, 101, 114, 95, 97, 99, 99, 101, 115, 115];
                }, {
                    readonly kind: "account";
                    readonly path: "taker";
                }];
                readonly program: {
                    readonly kind: "const";
                    readonly value: readonly [70, 114, 58, 183, 136, 135, 252, 146, 80, 123, 72, 5, 135, 248, 186, 224, 25, 166, 101, 165, 0, 26, 153, 232, 9, 37, 218, 240, 178, 106, 153, 93];
                };
            };
        }, {
            readonly name: "maker";
            readonly writable: true;
        }, {
            readonly name: "makerReceiver";
            readonly writable: true;
        }, {
            readonly name: "srcMint";
            readonly docs: readonly ["Maker asset"];
        }, {
            readonly name: "dstMint";
            readonly docs: readonly ["Taker asset"];
        }, {
            readonly name: "escrow";
            readonly docs: readonly ["PDA derived from order details, acting as the authority for the escrow ATA"];
        }, {
            readonly name: "escrowSrcAta";
            readonly docs: readonly ["ATA of src_mint to store escrowed tokens"];
            readonly writable: true;
            readonly pda: {
                readonly seeds: readonly [{
                    readonly kind: "account";
                    readonly path: "escrow";
                }, {
                    readonly kind: "account";
                    readonly path: "srcTokenProgram";
                }, {
                    readonly kind: "account";
                    readonly path: "srcMint";
                }];
                readonly program: {
                    readonly kind: "const";
                    readonly value: readonly [140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142, 13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216, 219, 233, 248, 89];
                };
            };
        }, {
            readonly name: "takerSrcAta";
            readonly docs: readonly ["Taker's ATA of src_mint"];
            readonly writable: true;
        }, {
            readonly name: "srcTokenProgram";
        }, {
            readonly name: "dstTokenProgram";
        }, {
            readonly name: "systemProgram";
            readonly address: "11111111111111111111111111111111";
        }, {
            readonly name: "associatedTokenProgram";
            readonly address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
        }, {
            readonly name: "makerDstAta";
            readonly docs: readonly ["Maker's ATA of dst_mint"];
            readonly writable: true;
            readonly optional: true;
            readonly pda: {
                readonly seeds: readonly [{
                    readonly kind: "account";
                    readonly path: "makerReceiver";
                }, {
                    readonly kind: "account";
                    readonly path: "dstTokenProgram";
                }, {
                    readonly kind: "account";
                    readonly path: "dstMint";
                }];
                readonly program: {
                    readonly kind: "const";
                    readonly value: readonly [140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142, 13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216, 219, 233, 248, 89];
                };
            };
        }, {
            readonly name: "takerDstAta";
            readonly docs: readonly ["Taker's ATA of dst_mint"];
            readonly writable: true;
            readonly optional: true;
            readonly pda: {
                readonly seeds: readonly [{
                    readonly kind: "account";
                    readonly path: "taker";
                }, {
                    readonly kind: "account";
                    readonly path: "dstTokenProgram";
                }, {
                    readonly kind: "account";
                    readonly path: "dstMint";
                }];
                readonly program: {
                    readonly kind: "const";
                    readonly value: readonly [140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142, 13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216, 219, 233, 248, 89];
                };
            };
        }, {
            readonly name: "protocolDstAcc";
            readonly writable: true;
            readonly optional: true;
        }, {
            readonly name: "integratorDstAcc";
            readonly writable: true;
            readonly optional: true;
        }];
        readonly args: readonly [{
            readonly name: "order";
            readonly type: {
                readonly defined: {
                    readonly name: "orderConfig";
                };
            };
        }, {
            readonly name: "amount";
            readonly type: "u64";
        }];
    }];
    readonly accounts: readonly [{
        readonly name: "resolverAccess";
        readonly discriminator: readonly [32, 2, 74, 248, 174, 108, 70, 156];
    }];
    readonly errors: readonly [{
        readonly code: 6000;
        readonly name: "inconsistentNativeSrcTrait";
        readonly msg: "Inconsistent native src trait";
    }, {
        readonly code: 6001;
        readonly name: "inconsistentNativeDstTrait";
        readonly msg: "Inconsistent native dst trait";
    }, {
        readonly code: 6002;
        readonly name: "invalidAmount";
        readonly msg: "Invalid amount";
    }, {
        readonly code: 6003;
        readonly name: "missingMakerDstAta";
        readonly msg: "Missing maker dst ata";
    }, {
        readonly code: 6004;
        readonly name: "notEnoughTokensInEscrow";
        readonly msg: "Not enough tokens in escrow";
    }, {
        readonly code: 6005;
        readonly name: "orderExpired";
        readonly msg: "Order expired";
    }, {
        readonly code: 6006;
        readonly name: "invalidEstimatedTakingAmount";
        readonly msg: "Invalid estimated taking amount";
    }, {
        readonly code: 6007;
        readonly name: "invalidProtocolSurplusFee";
        readonly msg: "Protocol surplus fee too high";
    }, {
        readonly code: 6008;
        readonly name: "inconsistentProtocolFeeConfig";
        readonly msg: "Inconsistent protocol fee config";
    }, {
        readonly code: 6009;
        readonly name: "inconsistentIntegratorFeeConfig";
        readonly msg: "Inconsistent integrator fee config";
    }, {
        readonly code: 6010;
        readonly name: "orderNotExpired";
        readonly msg: "Order not expired";
    }, {
        readonly code: 6011;
        readonly name: "invalidCancellationFee";
        readonly msg: "Invalid cancellation fee";
    }, {
        readonly code: 6012;
        readonly name: "cancelOrderByResolverIsForbidden";
        readonly msg: "Cancel order by resolver is forbidden";
    }, {
        readonly code: 6013;
        readonly name: "missingTakerDstAta";
        readonly msg: "Missing taker dst ata";
    }, {
        readonly code: 6014;
        readonly name: "missingMakerSrcAta";
        readonly msg: "Missing maker src ata";
    }];
    readonly types: readonly [{
        readonly name: "auctionData";
        readonly type: {
            readonly kind: "struct";
            readonly fields: readonly [{
                readonly name: "startTime";
                readonly type: "u32";
            }, {
                readonly name: "duration";
                readonly type: "u32";
            }, {
                readonly name: "initialRateBump";
                readonly type: "u16";
            }, {
                readonly name: "pointsAndTimeDeltas";
                readonly type: {
                    readonly vec: {
                        readonly defined: {
                            readonly name: "pointAndTimeDelta";
                        };
                    };
                };
            }];
        };
    }, {
        readonly name: "feeConfig";
        readonly docs: readonly ["Configuration for fees applied to the escrow"];
        readonly type: {
            readonly kind: "struct";
            readonly fields: readonly [{
                readonly name: "protocolFee";
                readonly docs: readonly ["Protocol fee in basis points where `BASE_1E5` = 100%"];
                readonly type: "u16";
            }, {
                readonly name: "integratorFee";
                readonly docs: readonly ["Integrator fee in basis points where `BASE_1E5` = 100%"];
                readonly type: "u16";
            }, {
                readonly name: "surplusPercentage";
                readonly docs: readonly ["Percentage of positive slippage taken by the protocol as an additional fee.", "Value in basis points where `BASE_1E2` = 100%"];
                readonly type: "u8";
            }, {
                readonly name: "maxCancellationPremium";
                readonly docs: readonly ["Maximum cancellation premium", "Value in absolute lamports amount"];
                readonly type: "u64";
            }];
        };
    }, {
        readonly name: "orderConfig";
        readonly type: {
            readonly kind: "struct";
            readonly fields: readonly [{
                readonly name: "id";
                readonly type: "u32";
            }, {
                readonly name: "srcAmount";
                readonly type: "u64";
            }, {
                readonly name: "minDstAmount";
                readonly type: "u64";
            }, {
                readonly name: "estimatedDstAmount";
                readonly type: "u64";
            }, {
                readonly name: "expirationTime";
                readonly type: "u32";
            }, {
                readonly name: "srcAssetIsNative";
                readonly type: "bool";
            }, {
                readonly name: "dstAssetIsNative";
                readonly type: "bool";
            }, {
                readonly name: "fee";
                readonly type: {
                    readonly defined: {
                        readonly name: "feeConfig";
                    };
                };
            }, {
                readonly name: "dutchAuctionData";
                readonly type: {
                    readonly defined: {
                        readonly name: "auctionData";
                    };
                };
            }, {
                readonly name: "cancellationAuctionDuration";
                readonly type: "u32";
            }];
        };
    }, {
        readonly name: "pointAndTimeDelta";
        readonly type: {
            readonly kind: "struct";
            readonly fields: readonly [{
                readonly name: "rateBump";
                readonly type: "u16";
            }, {
                readonly name: "timeDelta";
                readonly type: "u16";
            }];
        };
    }, {
        readonly name: "resolverAccess";
        readonly type: {
            readonly kind: "struct";
            readonly fields: readonly [{
                readonly name: "bump";
                readonly type: "u8";
            }];
        };
    }];
};
export declare const IDL: WritableDeep<typeof _IDL>;
export {};
