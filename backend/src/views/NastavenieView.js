/**
 * NastavenieView — View v MVC.
 *
 * Zodpovedá za formátovanie a odosielanie HTTP odpovedí pre nastavenia.
 * Controller nikdy nevolá res.json() priamo — deleguje to sem.
 */
export class NastavenieView {

    /**
     * Odpoveď pre GET /api/nastavenia  –  celá mapa key→value.
     * @param {import('express').Response} res
     * @param {Record<string, string>} map
     */
    static map(res, map) {
        res.json(map);
    }

    /**
     * Odpoveď pre GET /api/nastavenia/:key  –  jedno nastavenie.
     * @param {import('express').Response} res
     * @param {import('../entities/Nastavenie.js').Nastavenie} nastavenie
     */
    static single(res, nastavenie) {
        res.json(NastavenieView.#format(nastavenie));
    }

    /**
     * Odpoveď po úspešnom hromadnom uložení.
     * @param {import('express').Response} res
     * @param {Record<string, string>} map
     */
    static updated(res, map) {
        res.json(map);
    }

    /**
     * Odpoveď po úspešnom uložení jedného kľúča.
     * @param {import('express').Response} res
     * @param {import('../entities/Nastavenie.js').Nastavenie} nastavenie
     */
    static updatedSingle(res, nastavenie) {
        res.json(NastavenieView.#format(nastavenie));
    }

    static notFound(res) {
        res.status(404).json({ message: 'Nastavenie nebol nájdené.' });
    }

    static validationError(res, errors) {
        res.status(422).json({ errors });
    }

    // -------------------------------------------------------------------------

    static #format(nastavenie) {
        return {
            key:       nastavenie.key,
            value:     nastavenie.value,
            updatedAt: nastavenie.updatedAt,
        };
    }
}
