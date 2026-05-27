import { Router }               from 'express';
import { NastavenieController } from '../controllers/NastavenieController.js';

const router               = Router();
const nastavenieController = new NastavenieController();

// GET  /api/nastavenia          — všetky nastavenia ako { key: value }
router.get  ('/',     (req, res, next) => nastavenieController.index(req, res, next));

// GET  /api/nastavenia/:key     — jedno nastavenie
router.get  ('/:key', (req, res, next) => nastavenieController.show(req, res, next));

// PUT  /api/nastavenia          — hromadný update (celý objekt nastavení)
router.put  ('/',     (req, res, next) => nastavenieController.update(req, res, next));

// PATCH /api/nastavenia/:key    — update jedného kľúča { value: "..." }
router.patch('/:key', (req, res, next) => nastavenieController.patch(req, res, next));

export default router;
