"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = void 0;
const tslib_1 = require("tslib");
const bs58_1 = tslib_1.__importDefault(require("bs58"));
const byte_utils_1 = require("@1inch/byte-utils");
const web3_js_1 = require("@solana/web3.js");
class Address {
    static ASSOCIATED_TOKE_PROGRAM_ID = new Address('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
    static TOKEN_PROGRAM_ID = new Address('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
    static TOKEN_2022_PROGRAM_ID = new Address('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb');
    static SYSTEM_PROGRAM_ID = new Address('11111111111111111111111111111111');
    static WRAPPED_NATIVE = new Address('So11111111111111111111111111111111111111112');
    static NATIVE = new Address('SoNative11111111111111111111111111111111111');
    buf;
    constructor(value) {
        try {
            this.buf = bs58_1.default.decode(value);
            if (this.buf.length !== 32) {
                throw '';
            }
        }
        catch {
            throw new Error(`${value} is not a valid address.`);
        }
    }
    static fromUnknown(val) {
        if (!val) {
            throw new Error('invalid address');
        }
        if (typeof val === 'string') {
            return new Address(val);
        }
        if (typeof val === 'bigint') {
            return Address.fromBigInt(val);
        }
        if (typeof val === 'object' &&
            'toBuffer' in val &&
            typeof val.toBuffer === 'function') {
            const buffer = val.toBuffer();
            if (buffer instanceof Buffer || buffer instanceof Uint8Array) {
                return Address.fromBuffer(buffer);
            }
        }
        throw new Error('invalid address');
    }
    static unique() {
        return Address.fromPublicKey(web3_js_1.PublicKey.unique());
    }
    static fromPublicKey(publicKey) {
        return Address.fromBuffer(publicKey.toBuffer());
    }
    static fromBuffer(buf) {
        return new Address(bs58_1.default.encode(buf));
    }
    static fromBigInt(val) {
        const buffer = (0, byte_utils_1.hexToUint8Array)('0x' + val.toString(16).padStart(64, '0'));
        return Address.fromBuffer(buffer);
    }
    toString() {
        return bs58_1.default.encode(this.buf);
    }
    toJSON() {
        return this.toString();
    }
    toBuffer() {
        return Buffer.from(this.buf);
    }
    equal(other) {
        return this.toBuffer().equals(other.toBuffer());
    }
    isNative() {
        return this.equal(Address.NATIVE);
    }
}
exports.Address = Address;
//# sourceMappingURL=address.js.map