import { Address } from '../../domains/address';
import { Bps } from '../../domains';
export declare class FeeConfig {
    readonly protocolDstAta: Address | null;
    readonly integratorDstAta: Address | null;
    readonly protocolFee: Bps;
    readonly integratorFee: Bps;
    readonly surplusShare: Bps;
    /**
     * 100% = 100000
     */
    static BASE_1E5: bigint;
    /**
     * 100% = 100
     */
    static BASE_1E2: bigint;
    static ZERO: FeeConfig;
    constructor(protocolDstAta: Address | null, integratorDstAta: Address | null, protocolFee: Bps, integratorFee: Bps, surplusShare: Bps);
    static onlyProtocol(protocolDstAta: Address, protocolFee: Bps, surplusShare: Bps): FeeConfig;
    static onlyIntegrator(integratorDstAta: Address, fee: Bps): FeeConfig;
    isZero(): boolean;
}
