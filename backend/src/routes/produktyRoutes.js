import { Router }            from 'express';
import { ProduktController } from '../controllers/ProduktController.js';
import { requireAuth } from '../middleware/auth.js';
const router           = Router();
const produktController = new ProduktController();

router.get   ('/',    (req, res, next) => produktController.index(req, res, next));
router.get   ('/all', requireAuth, (req, res, next) => produktController.indexAll(req, res, next));
router.get   ('/:id', requireAuth, (req, res, next) => produktController.show(req, res, next));
router.use(requireAuth);
router.post  ('/',    requireAuth, (req, res, next) => produktController.store(req, res, next));
router.put   ('/:id', requireAuth, (req, res, next) => produktController.update(req, res, next));
router.delete('/:id', requireAuth, (req, res, next) => produktController.destroy(req, res, next));

export default router;
