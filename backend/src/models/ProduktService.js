import pool         from '../config/database.js';
import { Produkt }  from '../entities/Produkt.js';

/**
 * ProduktService — Model v MVC.
 *
 * Zodpovedá za všetku biznis logiku a prístup k databáze pre produkty.
 * Mapuje surové riadky z databázy na Produkt entity pred ich vrátením.
 */
export class ProduktService {

    /** @returns {Promise<Produkt[]>} */
    async findAll() {
        const { rows } = await pool.query(
            'SELECT * FROM produkty WHERE is_active = TRUE ORDER BY id'
        );
        return rows.map(row => this.#toEntity(row));
    }

    async findAllAdmin() {
        const { rows } = await pool.query(
            'SELECT * FROM produkty ORDER BY id'
        );
        return rows.map(row => this.#toEntity(row));
    }

    /**
     * @param {string} category
     * @returns {Promise<Produkt[]>}
     */
    async findByCategory(category) {
        const { rows } = await pool.query(
            'SELECT * FROM produkty WHERE category = $1 AND is_active = TRUE ORDER BY id',
            [category]
        );
        return rows.map(row => this.#toEntity(row));
    }

    /**
     * @param {number} id
     * @returns {Promise<Produkt|null>}
     */
    async findById(id) {
        const { rows } = await pool.query(
            'SELECT * FROM produkty WHERE id = $1',
            [id]
        );
        return rows.length ? this.#toEntity(rows[0]) : null;
    }

    /**
     * @param {{ name: string, description: string, price: string, category: string, image: string }} data
     * @returns {Promise<Produkt>}
     */
    async create(data) {
        const { rows } = await pool.query(
            `INSERT INTO produkty (name, description, price, category, image)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [data.name, data.description, data.price, data.category, data.image || null]
        );
        return this.#toEntity(rows[0]);
    }

    /**
     * @param {number} id
     * @param {object} data
     * @returns {Promise<Produkt|null>}
     */
    async updateById(id, data) {
        const fields  = [];
        const values  = [];
        let   paramIdx = 1;

        const allowed = ['name', 'description', 'price', 'category', 'image', 'is_active'];
        for (const key of allowed) {

            if (data[key] !== undefined || (key === 'is_active' && data.isActive !== undefined)) {
                fields.push(`${key} = $${paramIdx++}`);
                values.push(key === 'is_active' ? data.isActive : data[key]);
            }
        }

        if (fields.length === 0) return this.findById(id);

        fields.push(`updated_at = NOW()`);
        values.push(id);

        const { rows } = await pool.query(
            `UPDATE produkty SET ${fields.join(', ')} WHERE id = $${paramIdx} RETURNING *`,
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
            'DELETE FROM produkty WHERE id = $1',
            [id]
        );
        return rowCount > 0;
    }

    // -------------------------------------------------------------------------

    #toEntity(row) {
        return new Produkt({
            id:          row.id,
            name:        row.name,
            description: row.description,
            price:       row.price,
            category:    row.category,
            image:       row.image,
            isActive:    row.is_active,
            createdAt:   row.created_at,
            updatedAt:   row.updated_at,
        });
    }
}
