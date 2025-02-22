import {UINT_32_MAX} from '@1inch/byte-utils'

export function assertUInteger(val: number, max = UINT_32_MAX): void {
    if (!Number.isInteger(val)) {
        throw new Error(`Expected ${val} to be an integer`)
    }

    if (val < 0) {
        throw new Error(`Expected ${val} to be >= 0`)
    }

    if (val > max) {
        throw new Error(`Expected ${val} to be <= ${max}`)
    }
}
