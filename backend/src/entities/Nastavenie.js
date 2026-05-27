/**
 * Nastavenie entita — odráža stĺpce tabuľky `nastavenia`.
 * Jednoduchá dátová trieda bez akejkoľvek biznis logiky.
 */
export class Nastavenie {
    /** @type {string} */
    key;

    /** @type {string} */
    value;

    /** @type {Date} */
    updatedAt;

    constructor({ key, value, updatedAt }) {
        this.key       = key;
        this.value     = value;
        this.updatedAt = updatedAt;
    }
}
