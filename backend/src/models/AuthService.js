import bcrypt               from 'bcrypt';
import jwt                  from 'jsonwebtoken';
import pool                 from '../config/database.js';
import { AdminUser }        from '../entities/AdminUser.js';
import { verifyTotp,
         generateTotpSecret,
         buildOtpauthUri }  from '../utils/totp.js';

const JWT_SECRET  = process.env.JWT_SECRET  ?? 'change-me-in-production';
const JWT_EXPIRES = process.env.JWT_EXPIRES ?? '8h';

/**
 * AuthService — Model v MVC pre autentifikáciu.
 *
 * Kroky prihlásenia:
 *   1. verifyPassword(username, password) → partial JWT (step=password)
 *   2. verifyTotp(partialToken, totpCode) → full JWT (step=done)
 *
 * Všetky route handlery overujú plný JWT cez requireAuth middleware.
 */
export class AuthService {

    // -----------------------------------------------------------------------
    // Step 1 — username + password
    // -----------------------------------------------------------------------

    /**
     * Overí meno a heslo.  Pri úspechu vráti krátkodobý "partial" token.
     * @param {string} username
     * @param {string} password  plaintext
     * @returns {Promise<{ partialToken: string } | null>}
     */
    async verifyPassword(username, password) {
        const user = await this.#findByUsername(username);
        if (!user) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        // Partial token — only valid for the TOTP step, expires in 5 min
        const partialToken = jwt.sign(
            { sub: user.id, username: user.username, step: 'totp' },
            JWT_SECRET,
            { expiresIn: '5m' }
        );
        return { partialToken };
    }

    // -----------------------------------------------------------------------
    // Step 2 — TOTP
    // -----------------------------------------------------------------------

    /**
     * Overí TOTP kód z partial tokenu.  Pri úspechu vráti plný session token.
     * @param {string} partialToken
     * @param {string} totpCode
     * @returns {Promise<{ token: string } | null>}
     */
    async verifyTotpStep(partialToken, totpCode) {
        let payload;
        try {
            payload = jwt.verify(partialToken, JWT_SECRET);
        } catch {
            return null;
        }

        if (payload.step !== 'totp') return null;

        const user = await this.#findById(payload.sub);
        if (!user) return null;

        if (user.totpEnabled) {
            const ok = verifyTotp(user.totpSecret, totpCode);
            if (!ok) return null;
        }

        const token = jwt.sign(
            { sub: user.id, username: user.username, step: 'done' },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES }
        );
        return { token };
    }

    // -----------------------------------------------------------------------
    // Admin management
    // -----------------------------------------------------------------------

    /**
     * Vytvorí nového admin používateľa s hashovaným heslom a TOTP secretom.
     * Vráti { user, otpauthUri } — URI použite na vygenerovanie QR kódu.
     * @param {string} username
     * @param {string} password  plaintext
     * @returns {Promise<{ user: AdminUser, otpauthUri: string }>}
     */
    async createAdmin(username, password) {
        const passwordHash = await bcrypt.hash(password, 12);
        const totpSecret   = generateTotpSecret();

        const { rows } = await pool.query(
            `INSERT INTO admin_users (username, password_hash, totp_secret)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [username, passwordHash, totpSecret]
        );

        const user       = this.#toEntity(rows[0]);
        const otpauthUri = buildOtpauthUri(totpSecret, username);
        return { user, otpauthUri };
    }

    /**
     * Overí JWT token.  Vráti payload alebo null.
     * @param {string} token
     * @returns {{ sub: number, username: string } | null}
     */
    verifyToken(token) {
        try {
            const payload = jwt.verify(token, JWT_SECRET);
            if (payload.step !== 'done') return null;
            return payload;
        } catch {
            return null;
        }
    }

    // -----------------------------------------------------------------------
    // Private
    // -----------------------------------------------------------------------

    async #findByUsername(username) {
        const { rows } = await pool.query(
            'SELECT * FROM admin_users WHERE username = $1',
            [username]
        );
        return rows.length ? this.#toEntity(rows[0]) : null;
    }

    async #findById(id) {
        const { rows } = await pool.query(
            'SELECT * FROM admin_users WHERE id = $1',
            [id]
        );
        return rows.length ? this.#toEntity(rows[0]) : null;
    }

    #toEntity(row) {
        return new AdminUser({
            id:           row.id,
            username:     row.username,
            passwordHash: row.password_hash,
            totpSecret:   row.totp_secret,
            totpEnabled:  row.totp_enabled,
            createdAt:    row.created_at,
        });
    }
}
