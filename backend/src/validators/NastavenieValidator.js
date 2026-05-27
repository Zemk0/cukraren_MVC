/**
 * NastavenieValidator — Validator v MVC.
 *
 * Overí biznis pravidlá pre nastavenia.
 * Vracia pole chybových hlásení (prázdne = validné).
 */
export class NastavenieValidator {

    static #EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    static #PHONE_RE = /^[+\d\s\-()]{6,20}$/;

    /**
     * Validuje celý objekt nastavení.
     * @param {Record<string, string>} data
     * @returns {string[]}
     */
    static forUpdate(data) {
        const errors = [];

        if ('shopName' in data && !data.shopName) {
            errors.push('Názov cukrárne nesmie byť prázdny.');
        }

        if ('email' in data && data.email && !NastavenieValidator.#EMAIL_RE.test(data.email)) {
            errors.push('Email má nesprávny formát.');
        }

        if ('phone' in data && data.phone && !NastavenieValidator.#PHONE_RE.test(data.phone)) {
            errors.push('Telefónne číslo má nesprávny formát.');
        }

        if ('hoursWeekdays' in data && data.hoursWeekdays && data.hoursWeekdays.length > 50) {
            errors.push('Otváracie hodiny (pracovné dni) sú príliš dlhé.');
        }

        if ('hoursSaturday' in data && data.hoursSaturday && data.hoursSaturday.length > 50) {
            errors.push('Otváracie hodiny (sobota) sú príliš dlhé.');
        }

        if ('hoursSunday' in data && data.hoursSunday && data.hoursSunday.length > 50) {
            errors.push('Otváracie hodiny (nedeľa) sú príliš dlhé.');
        }

        return errors;
    }

    /**
     * Validuje jeden kľúč + hodnotu.
     * @param {string} key
     * @param {string} value
     * @returns {string[]}
     */
    static forSingleUpdate(key, value) {
        return NastavenieValidator.forUpdate({ [key]: value });
    }
}
