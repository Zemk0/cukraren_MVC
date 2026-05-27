import { AuthService } from '../models/AuthService.js';

const authService = new AuthService();

/**
 * requireAuth — Express middleware.
 *
 * Overí JWT token z hlavičky Authorization: Bearer <token>.
 * Pri úspechu pridá `req.admin` s payload tokenu a zavolá next().
 * Pri neúspechu vráti 401.
 *
 * Použitie v routes:
 *   import { requireAuth } from '../middleware/auth.js';
 *   router.get('/protected', requireAuth, handler);
 *
 *   // alebo celý router:
 *   router.use(requireAuth);
 */
export function requireAuth(req, res, next) {
    const header = req.headers['authorization'] ?? '';
    const token  = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
        return res.status(401).json({ message: 'Prístup zamietnutý — chýba token.' });
    }

    const payload = authService.verifyToken(token);
    if (!payload) {
        return res.status(401).json({ message: 'Prístup zamietnutý — neplatný alebo expirovaný token.' });
    }

    req.admin = payload;
    next();
}
