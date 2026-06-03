import { Router }             from 'express';
import { GaleriaController }  from '../controllers/GaleriaController.js';
import { requireAuth } from '../middleware/auth.js';
const router            = Router();
const galeriaController = new GaleriaController();

router.get   ('/',    (req, res, next) => galeriaController.index(req, res, next));
router.get   ('/:id', (req, res, next) => galeriaController.show(req, res, next));
router.use(requireAuth);
router.post  ('/',requireAuth, (req, res, next) => galeriaController.store(req, res, next));
router.delete('/:id', requireAuth, (req, res, next) => galeriaController.destroy(req, res, next));

export default router;
