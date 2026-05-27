/**
 * totp.js — Minimal RFC-6238 TOTP implementation.
 *
 * Uses only Node.js built-ins (crypto).  No extra npm packages needed.
 * Compatible with Google Authenticator, Authy, and any standard TOTP app.
 */

import { createHmac, randomBytes } from 'node:crypto';

// ---------------------------------------------------------------------------
// Base32 helpers
// ---------------------------------------------------------------------------

const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

/**
 * Encode a Buffer to a base32 string (RFC-4648, no padding).
 * @param {Buffer} buf
 * @returns {string}
 */
export function base32Encode(buf) {
    let bits  = 0;
    let value = 0;
    let output = '';
    for (const byte of buf) {
        value = (value << 8) | byte;
        bits += 8;
        while (bits >= 5) {
            output += BASE32_CHARS[(value >>> (bits - 5)) & 31];
            bits -= 5;
        }
    }
    if (bits > 0) output += BASE32_CHARS[(value << (5 - bits)) & 31];
    return output;
}

/**
 * Decode a base32 string to a Buffer.
 * @param {string} str
 * @returns {Buffer}
 */
export function base32Decode(str) {
    const clean = str.toUpperCase().replace(/=+$/, '');
    let bits  = 0;
    let value = 0;
    const bytes = [];
    for (const char of clean) {
        const idx = BASE32_CHARS.indexOf(char);
        if (idx === -1) continue;
        value = (value << 5) | idx;
        bits += 5;
        if (bits >= 8) {
            bytes.push((value >>> (bits - 8)) & 255);
            bits -= 8;
        }
    }
    return Buffer.from(bytes);
}

// ---------------------------------------------------------------------------
// TOTP core
// ---------------------------------------------------------------------------

/**
 * Generate a random 20-byte TOTP secret, returned as base32.
 * @returns {string}
 */
export function generateTotpSecret() {
    return base32Encode(randomBytes(20));
}

/**
 * Compute the current TOTP code for a given base32 secret.
 * @param {string} secret   Base32-encoded secret
 * @param {number} [offset] Time-step offset (0 = current, ±1 = adjacent windows)
 * @returns {string}        6-digit zero-padded OTP
 */
export function generateTotp(secret, offset = 0) {
    const key     = base32Decode(secret);
    const step    = Math.floor(Date.now() / 1000 / 30) + offset;
    const counter = Buffer.alloc(8);
    counter.writeUInt32BE(Math.floor(step / 2 ** 32), 0);
    counter.writeUInt32BE(step >>> 0, 4);

    const hmac  = createHmac('sha1', key).update(counter).digest();
    const offset2 = hmac[hmac.length - 1] & 0x0f;
    const code  = (
        ((hmac[offset2]     & 0x7f) << 24) |
        ((hmac[offset2 + 1] & 0xff) << 16) |
        ((hmac[offset2 + 2] & 0xff) <<  8) |
         (hmac[offset2 + 3] & 0xff)
    ) % 1_000_000;

    return String(code).padStart(6, '0');
}

/**
 * Verify a TOTP token.  Accepts current window ± 1 step (90-second tolerance).
 * @param {string} secret   Base32-encoded secret
 * @param {string} token    6-digit code from authenticator app
 * @returns {boolean}
 */
export function verifyTotp(secret, token) {
    const cleaned = String(token).replace(/\s/g, '');
    for (const offset of [-1, 0, 1]) {
        if (generateTotp(secret, offset) === cleaned) return true;
    }
    return false;
}

/**
 * Build an otpauth:// URI for QR code generation.
 * @param {string} secret
 * @param {string} username
 * @param {string} [issuer]
 * @returns {string}
 */
export function buildOtpauthUri(secret, username, issuer = 'Cukráreň Janka Admin') {
    const label = encodeURIComponent(`${issuer}:${username}`);
    return `otpauth://totp/${label}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;
}
