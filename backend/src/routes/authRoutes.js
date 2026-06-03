import { Router }         from 'express';
import { AuthController } from '../controllers/AuthController.js';
import { authRateLimiter } from '../../index.js';
const router         = Router();
const authController = new AuthController();

// POST /api/auth/login   — krok 1: meno + heslo → partialToken
router.post('/login', authRateLimiter, (req, res, next) => authController.login(req, res, next));

// POST /api/auth/totp    — krok 2: partialToken + TOTP kód → JWT
router.post('/totp', authRateLimiter, (req, res, next) => authController.totp(req, res, next));

// POST /api/auth/setup   — prvotné vytvorenie admin účtu
router.post('/setup', authRateLimiter,   (req, res, next) => authController.setup(req, res, next));

export default router;
