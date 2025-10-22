import assert from 'assert';
import { Bps } from '../../domains';
export class FeeConfig {
    protocolDstAta;
    integratorDstAta;
    protocolFee;
    integratorFee;
    surplusShare;
    /**
     * 100% = 100000
     */
    static BASE_1E5 = 100000n;
    /**
     * 100% = 100
     */
    static BASE_1E2 = 100n;
    static ZERO = new FeeConfig(null, null, Bps.ZERO, Bps.ZERO, Bps.ZERO);
    constructor(protocolDstAta, integratorDstAta, protocolFee, integratorFee, surplusShare) {
        this.protocolDstAta = protocolDstAta;
        this.integratorDstAta = integratorDstAta;
        this.protocolFee = protocolFee;
        this.integratorFee = integratorFee;
        this.surplusShare = surplusShare;
        const isProtocolFeeValid = (protocolDstAta === null &&
            !(protocolFee.isZero() && surplusShare.isZero())) ||
            (protocolDstAta !== null &&
                protocolFee.isZero() &&
                surplusShare.isZero());
        if (isProtocolFeeValid) {
            throw new Error('protocol fee config mismatch');
        }
        const isIntegratorFeeValid = (integratorDstAta === null && !integratorFee.isZero()) ||
            (integratorDstAta !== null && integratorFee.isZero());
        if (isIntegratorFeeValid) {
            throw new Error('integrator fee config mismatch');
        }
        assert(this.protocolFee.toFraction() < 0.6553, 'max fee is 65.53%' // 2 bytes with 1e5 base
        );
        assert(this.integratorFee.toFraction() < 0.6553, 'max fee is 65.53%' // 2 bytes with 1e5 base
        );
        assert(this.surplusShare.toFraction() <= 1, 'max surplus share is 100%');
        assert(this.surplusShare.value % 100n === 0n, `surplus share must have percent precision: 1%, 2% and so on`);
    }
    static onlyProtocol(protocolDstAta, protocolFee, surplusShare) {
        return new FeeConfig(protocolDstAta, null, protocolFee, Bps.ZERO, surplusShare);
    }
    static onlyIntegrator(integratorDstAta, fee) {
        return new FeeConfig(null, integratorDstAta, Bps.ZERO, fee, Bps.ZERO);
    }
    isZero() {
        return this.protocolDstAta == null && this.integratorDstAta == null;
    }
}
//# sourceMappingURL=fee-config.js.map