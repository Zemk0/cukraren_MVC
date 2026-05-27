import { Router }          from 'express';
import { requireAuth }     from '../middleware/auth.js';
import authRoutes          from './authRoutes.js';
import produktyRoutes      from './produktyRoutes.js';
import novinkyRoutes       from './novinkyRoutes.js';
import galeriaRoutes       from './galeriaRoutes.js';
import nastavenieRoutes    from './nastavenieRoutes.js';

const router = Router();

// Public
router.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth (public — no requireAuth)
router.use('/auth', authRoutes);

router.use('/produkty',   produktyRoutes);
router.use('/novinky',    novinkyRoutes);
router.use('/galeria',    galeriaRoutes);

// Protected — all routes below require a valid JWT
router.use(requireAuth);


router.use('/nastavenia', nastavenieRoutes);

export default router;
