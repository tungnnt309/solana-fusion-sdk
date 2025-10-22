import assert from 'assert';
/**
 * Basis point in range [0, 100]%
 *
 * 1bps = 0.01%
 */
export class Bps {
    value;
    static ZERO = new Bps(0n);
    constructor(value) {
        this.value = value;
        assert(value >= 0 && value <= 10000, `invalid bps ${value}`);
    }
    /**
     * Create BPS from percent value.
     * If `value` has precision more than 1bps (with accounting to `base`), it will be rounded down
     * @param val
     * @param base what represents 100%
     */
    static fromPercent(val, base = 1n) {
        return new Bps(BigInt(100 * val) / base);
    }
    /**
     * Create BPS from fraction value.
     * If `value` has precision more than 1bps (with accounting to `base`), it will be rounded down
     * @param val
     * @param base what represents 100%
     */
    static fromFraction(val, base = 1n) {
        return new Bps(BigInt(10000 * val) / base);
    }
    equal(other) {
        return this.value === other.value;
    }
    isZero() {
        return this.value === 0n;
    }
    /**
     * @param base what represents 100%
     */
    toPercent(base = 1n) {
        return Number(this.value * base) / 100;
    }
    /**
     * @param base what represents 100%
     */
    toFraction(base = 1n) {
        return Number(this.value * base) / 10000;
    }
    toString() {
        return this.value.toString();
    }
}
//# sourceMappingURL=bps.js.map