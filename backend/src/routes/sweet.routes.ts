
import { Router } from 'express';
import { authenticate, isAdmin } from '../middleware/auth.middleware';
import * as controller from '../controllers/sweet.controller';

const router = Router();

router.get('/', authenticate, controller.getAllSweets);
router.get('/search', authenticate, controller.searchSweets);
router.post('/', authenticate, isAdmin, controller.createSweet);
router.put('/:id', authenticate, isAdmin, controller.updateSweet);
router.delete('/:id', authenticate, isAdmin, controller.deleteSweet);
router.post('/:id/purchase', authenticate, controller.purchaseSweet);
router.post('/:id/restock', authenticate, isAdmin, controller.restockSweet);

export default router;
