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
import Order from '../models/Order';

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
// public: історія замовлень по телефону
router.get('/by-phone/:phone', async (req, res) => {
  try {
    const phone = req.params.phone;
    const orders = await Order.find({ customerPhone: phone }).populate("items.menuId");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Помилка при отриманні замовлень" });
  }
});

// admin
router.get('/', adminAuth, listOrders);
router.get('/:id', adminAuth, getOrder);
router.patch('/:id/status', adminAuth, [ body('status').isIn(['new','in_progress','done']) ], validate, updateOrderStatus);

export default router;
