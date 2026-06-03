import { Router }            from 'express';
import { NovinkaController } from '../controllers/NovinkaController.js';
import { requireAuth } from '../middleware/auth.js';
const router            = Router();
const novinkaController = new NovinkaController();

router.get   ('/',    (req, res, next) => novinkaController.index(req, res, next));
router.get   ('/:id', (req, res, next) => novinkaController.show(req, res, next));
router.use(requireAuth);
router.post  ('/', requireAuth, (req, res, next) => novinkaController.store(req, res, next));
router.put   ('/:id', requireAuth, (req, res, next) => novinkaController.update(req, res, next));
router.delete('/:id', requireAuth, (req, res, next) => novinkaController.destroy(req, res, next));

export default router;
