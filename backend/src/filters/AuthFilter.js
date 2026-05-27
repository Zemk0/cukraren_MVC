/**
 * AuthFilter — očistí vstup pre autentifikačné endpointy.
 */
export class AuthFilter {

    /** @param {object} body */
    static forLogin(body) {
        return {
            username: String(body.username ?? '').trim().toLowerCase(),
            password: String(body.password ?? ''),
        };
    }

    /** @param {object} body */
    static forTotp(body) {
        return {
            partialToken: String(body.partialToken ?? '').trim(),
            totpCode:     String(body.totpCode ?? '').replace(/\s/g, ''),
        };
    }
}
