import { Router } from 'express';
import {
  createOrder,
  listOrders,
  getOrder,
  updateOrderStatus
} from '../controllers/orderController';
import { adminAuth } from '../middleware/auth';
import { body } from 'express-validator';
import { validate } from '../utils/validators';

const router = Router();

// public
router.post(
  '/',
  [
    body('customerName').isString().notEmpty(),
    body('customerPhone').isString().notEmpty(),
    body('items').isArray({ min: 1 }),
    body('items.*.menuId').isString().notEmpty(),
    body('items.*.quantity').optional().isInt({ min: 1 })
  ],
  validate,
  createOrder
);

// admin
router.get('/', adminAuth, listOrders);
router.get('/:id', adminAuth, getOrder);
router.patch('/:id/status', adminAuth, [ body('status').isIn(['new','in_progress','done']) ], validate, updateOrderStatus);

export default router;
