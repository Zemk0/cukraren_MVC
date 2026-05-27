import pool          from '../config/database.js';
import { Novinka }   from '../entities/Novinka.js';

/**
 * NovinkaService — Model v MVC.
 */
export class NovinkaService {

    /** @returns {Promise<Novinka[]>} */
    async findAll() {
        const { rows } = await pool.query(
            'SELECT * FROM novinky ORDER BY date DESC, id DESC'
        );
        return rows.map(row => this.#toEntity(row));
    }

    /**
     * @param {number} id
     * @returns {Promise<Novinka|null>}
     */
    async findById(id) {
        const { rows } = await pool.query(
            'SELECT * FROM novinky WHERE id = $1',
            [id]
        );
        return rows.length ? this.#toEntity(rows[0]) : null;
    }

    /**
     * @param {{ title, excerpt, content, image, date }} data
     * @returns {Promise<Novinka>}
     */
    async create(data) {
        const { rows } = await pool.query(
            `INSERT INTO novinky (title, excerpt, content, image, date)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [
                data.title,
                data.excerpt || null,
                data.content,
                data.image   || null,
                data.date    || new Date(),
            ]
        );
        return this.#toEntity(rows[0]);
    }

    /**
     * @param {number} id
     * @param {object} data
     * @returns {Promise<Novinka|null>}
     */
    async updateById(id, data) {
        const fields   = [];
        const values   = [];
        let   paramIdx = 1;

        const allowed = ['title', 'excerpt', 'content', 'image', 'date'];
        for (const key of allowed) {
            if (data[key] !== undefined) {
                fields.push(`${key} = $${paramIdx++}`);
                values.push(data[key]);
            }
        }

        if (fields.length === 0) return this.findById(id);

        fields.push('updated_at = NOW()');
        values.push(id);

        const { rows } = await pool.query(
            `UPDATE novinky SET ${fields.join(', ')} WHERE id = $${paramIdx} RETURNING *`,
            values
        );
        return rows.length ? this.#toEntity(rows[0]) : null;
    }

    /**
     * @param {number} id
     * @returns {Promise<boolean>}
     */
    async deleteById(id) {
        const { rowCount } = await pool.query(
            'DELETE FROM novinky WHERE id = $1',
            [id]
        );
        return rowCount > 0;
    }

    // -------------------------------------------------------------------------

    #toEntity(row) {
        return new Novinka({
            id:        row.id,
            title:     row.title,
            excerpt:   row.excerpt,
            content:   row.content,
            image:     row.image,
            date:      row.date,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        });
    }
}
