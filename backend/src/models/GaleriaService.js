import pool              from '../config/database.js';
import { GaleriaItem }  from '../entities/GaleriaItem.js';

/**
 * GaleriaService — Model v MVC.
 */
export class GaleriaService {

    /** @returns {Promise<GaleriaItem[]>} */
    async findAll() {
        const { rows } = await pool.query(
            'SELECT * FROM galeria ORDER BY id DESC'
        );
        return rows.map(row => this.#toEntity(row));
    }

    /**
     * @param {number} id
     * @returns {Promise<GaleriaItem|null>}
     */
    async findById(id) {
        const { rows } = await pool.query(
            'SELECT * FROM galeria WHERE id = $1',
            [id]
        );
        return rows.length ? this.#toEntity(rows[0]) : null;
    }

    /**
     * @param {{ title: string, image: string }} data
     * @returns {Promise<GaleriaItem>}
     */
    async create(data) {
        const { rows } = await pool.query(
            `INSERT INTO galeria (title, image)
             VALUES ($1, $2)
             RETURNING *`,
            [data.title, data.image || null]
        );
        return this.#toEntity(rows[0]);
    }

    /**
     * @param {number} id
     * @returns {Promise<boolean>}
     */
    async deleteById(id) {
        const { rowCount } = await pool.query(
            'DELETE FROM galeria WHERE id = $1',
            [id]
        );
        return rowCount > 0;
    }

    // -------------------------------------------------------------------------

    #toEntity(row) {
        return new GaleriaItem({
            id:        row.id,
            title:     row.title,
            image:     row.image,
            createdAt: row.created_at,
        });
    }
}
