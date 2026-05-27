import pool            from '../config/database.js';
import { Nastavenie }  from '../entities/Nastavenie.js';

/**
 * NastavenieService — Model v MVC.
 *
 * Zodpovedá za všetku biznis logiku a prístup k databáze pre nastavenia.
 * Nastavenia sú uložené ako key-value páry (napr. shopName, phone …).
 */
export class NastavenieService {

    /**
     * Vráti všetky nastavenia ako jeden objekt { key: value, … }.
     * @returns {Promise<Record<string, string>>}
     */
    async findAll() {
        const { rows } = await pool.query(
            'SELECT key, value, updated_at FROM nastavenia ORDER BY key'
        );
        return this.#toMap(rows);
    }

    /**
     * Vráti hodnotu jedného kľúča, alebo null.
     * @param {string} key
     * @returns {Promise<Nastavenie|null>}
     */
    async findByKey(key) {
        const { rows } = await pool.query(
            'SELECT key, value, updated_at FROM nastavenia WHERE key = $1',
            [key]
        );
        if (!rows.length) return null;
        return this.#toEntity(rows[0]);
    }

    /**
     * Uloží / aktualizuje viacero nastavení naraz (upsert).
     * @param {Record<string, string>} map  –  { key: value, … }
     * @returns {Promise<Record<string, string>>}
     */
    async setMany(map) {
        const entries = Object.entries(map);
        if (!entries.length) return this.findAll();

        // Batch upsert pomocou VALUES list
        const values   = [];
        const placeholders = entries.map(([k, v], i) => {
            values.push(k, v);
            return `($${i * 2 + 1}, $${i * 2 + 2})`;
        });

        await pool.query(
            `INSERT INTO nastavenia (key, value)
             VALUES ${placeholders.join(', ')}
             ON CONFLICT (key) DO UPDATE
                 SET value      = EXCLUDED.value,
                     updated_at = NOW()`,
            values
        );

        return this.findAll();
    }

    /**
     * Aktualizuje hodnotu jedného kľúča.
     * @param {string} key
     * @param {string} value
     * @returns {Promise<Nastavenie|null>}
     */
    async setOne(key, value) {
        const { rows } = await pool.query(
            `INSERT INTO nastavenia (key, value)
             VALUES ($1, $2)
             ON CONFLICT (key) DO UPDATE
                 SET value      = EXCLUDED.value,
                     updated_at = NOW()
             RETURNING key, value, updated_at`,
            [key, value]
        );
        return rows.length ? this.#toEntity(rows[0]) : null;
    }

    // -------------------------------------------------------------------------

    /** @param {object} row */
    #toEntity(row) {
        return new Nastavenie({
            key:       row.key,
            value:     row.value,
            updatedAt: row.updated_at,
        });
    }

    /** @param {object[]} rows */
    #toMap(rows) {
        return Object.fromEntries(rows.map(r => [r.key, r.value]));
    }
}
