import { Router } from 'express';
import {
  getMenu,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} from '../controllers/menuController';
import { adminAuth } from '../middleware/auth';
import { body } from 'express-validator';
import { validate } from '../utils/validators';

const router = Router();

router.get('/', getMenu);
router.get('/:id', getMenuItem);

router.post(
  '/',
  adminAuth,
  [
    body('name').isString().notEmpty(),
    body('price').isFloat({ min: 0 })
  ],
  validate,
  createMenuItem
);

router.put(
  '/:id',
  adminAuth,
  [
    body('name').optional().isString(),
    body('price').optional().isFloat({ min: 0 })
  ],
  validate,
  updateMenuItem
);

router.delete('/:id', adminAuth, deleteMenuItem);

export default router;
