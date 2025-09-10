import { Request, Response } from 'express';
import Order from '../models/Order';
import Menu from '../models/Menu';
import mongoose from 'mongoose';

// POST /api/orders
export const createOrder = async (req: Request, res: Response) => {
  const { customerName, customerPhone, items } = req.body;
  // items: [{ menuId, quantity }]
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Order must include items' });
  }

  // build order items with price snapshot
  const populatedItems = await Promise.all(items.map(async (it: any) => {
    if (!mongoose.Types.ObjectId.isValid(it.menuId)) throw new Error('Invalid menuId');
    const menu = await Menu.findById(it.menuId);
    if (!menu) throw new Error('Menu item not found: ' + it.menuId);
    return {
      menuId: menu._id,
      name: menu.name,
      price: menu.price,
      quantity: it.quantity || 1
    };
  }));

  const order = new Order({ customerName, customerPhone, items: populatedItems });
  await order.save();
  res.status(201).json(order);
};

// GET /api/orders (admin) - list
export const listOrders = async (_req: Request, res: Response) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
};

// GET /api/orders/:id
export const getOrder = async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
};

// PATCH /api/orders/:id/status (admin)
export const updateOrderStatus = async (req: Request, res: Response) => {
  const { status } = req.body;
  if (!['new', 'in_progress', 'done'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
};
