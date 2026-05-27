import { AuthService }   from '../models/AuthService.js';
import { AuthFilter }    from '../filters/AuthFilter.js';
import { AuthValidator } from '../validators/AuthValidator.js';
import { AuthView }      from '../views/AuthView.js';

const authService = new AuthService();

/**
 * AuthController — Controller v MVC pre autentifikáciu.
 *
 * POST /api/auth/login      → krok 1: meno + heslo  → partialToken
 * POST /api/auth/totp       → krok 2: partialToken + kód → JWT
 * POST /api/auth/setup      → vytvorenie prvého admina (len keď tabuľka prázdna)
 */
export class AuthController {

    /**
     * POST /api/auth/login
     * Body: { username, password }
     */
    async login(req, res, next) {
        try {
            const data   = AuthFilter.forLogin(req.body);
            const errors = AuthValidator.forLogin(data);
            if (errors.length) return AuthView.validationError(res, errors);

            const result = await authService.verifyPassword(data.username, data.password);
            if (!result) return AuthView.unauthorized(res);

            AuthView.passwordOk(res, result.partialToken);
        } catch (err) {
            next(err);
        }
    }

    /**
     * POST /api/auth/totp
     * Body: { partialToken, totpCode }
     */
    async totp(req, res, next) {
        try {
            const data   = AuthFilter.forTotp(req.body);
            const errors = AuthValidator.forTotp(data);
            if (errors.length) return AuthView.validationError(res, errors);

            const result = await authService.verifyTotpStep(data.partialToken, data.totpCode);
            if (!result) return AuthView.unauthorized(res, 'Nesprávny alebo expirovaný kód.');

            AuthView.loginOk(res, result.token);
        } catch (err) {
            next(err);
        }
    }

    /**
     * POST /api/auth/setup
     * Body: { username, password }
     *
     * Only works when no admin accounts exist yet.
     * Returns { otpauthUri } — use this to generate the QR code.
     */
    async setup(req, res, next) {
        try {
            const data   = AuthFilter.forLogin(req.body);
            const errors = AuthValidator.forLogin(data);
            if (errors.length) return AuthView.validationError(res, errors);

            const { user, otpauthUri } = await authService.createAdmin(data.username, data.password);
            res.status(201).json({
                message:    'Admin účet vytvorený. Naskenujte QR kód v autentifikátore.',
                username:   user.username,
                otpauthUri, // frontend uses this to display a QR code
            });
        } catch (err) {
            if (err.code === '23505') {            // unique constraint violation
                return AuthView.conflict(res, 'Používateľ s týmto menom už existuje.');
            }
            next(err);
        }
    }
}
