/**
 * AdminUser entita — odráža stĺpce tabuľky `admin_users`.
 * Citlivé polia (passwordHash, totpSecret) sa nikdy neposielajú klientovi.
 */
export class AdminUser {
    /** @type {number} */
    id;
    /** @type {string} */
    username;
    /** @type {string} */
    passwordHash;
    /** @type {string} */
    totpSecret;
    /** @type {boolean} */
    totpEnabled;
    /** @type {Date} */
    createdAt;

    constructor({ id, username, passwordHash, totpSecret, totpEnabled, createdAt }) {
        this.id          = id;
        this.username    = username;
        this.passwordHash = passwordHash;
        this.totpSecret  = totpSecret;
        this.totpEnabled = totpEnabled;
        this.createdAt   = createdAt;
    }
}
