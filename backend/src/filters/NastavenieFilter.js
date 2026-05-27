/**
 * NastavenieFilter — Filter v MVC.
 *
 * Očistí a normalizuje surový vstup pred validáciou a uložením.
 * Neobsahuje žiadnu biznis logiku ani validačné pravidlá.
 */
export class NastavenieFilter {

    /** Povolené kľúče pre bulk update */
    static #ALLOWED_KEYS = [
        'shopName',
        'address',
        'city',
        'phone',
        'email',
        'hoursWeekdays',
        'hoursSaturday',
        'hoursSunday',
    ];

    /**
     * Očistí vstupný objekt pre hromadný update nastavení.
     * @param {object} body
     * @returns {Record<string, string>}
     */
    static forUpdate(body) {
        const result = {};
        for (const key of NastavenieFilter.#ALLOWED_KEYS) {
            if (key in body) {
                result[key] = String(body[key] ?? '').trim();
            }
        }
        return result;
    }

    /**
     * Očistí vstup pre update jedného kľúča.
     * @param {string} key
     * @param {*}      value
     * @returns {{ key: string, value: string }}
     */
    static forSingleUpdate(key, value) {
        return {
            key:   String(key ?? '').trim(),
            value: String(value ?? '').trim(),
        };
    }
}
