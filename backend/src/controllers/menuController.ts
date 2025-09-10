import { Request, Response } from 'express';
import Menu from '../models/Menu';

// GET /api/menu
export const getMenu = async (_req: Request, res: Response) => {
  const items = await Menu.find().sort({ createdAt: -1 });
  res.json(items);
};

// GET /api/menu/:id
export const getMenuItem = async (req: Request, res: Response) => {
  const item = await Menu.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Menu item not found' });
  res.json(item);
};

// POST /api/menu  (admin)
export const createMenuItem = async (req: Request, res: Response) => {
  const { name, description, price, imageUrl, category } = req.body;
  const item = new Menu({ name, description, price, imageUrl, category });
  await item.save();
  res.status(201).json(item);
};

// PUT /api/menu/:id (admin)
export const updateMenuItem = async (req: Request, res: Response) => {
  const item = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.status(404).json({ message: 'Menu item not found' });
  res.json(item);
};

// DELETE /api/menu/:id (admin)
export const deleteMenuItem = async (req: Request, res: Response) => {
  const item = await Menu.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Menu item not found' });
  res.json({ message: 'Deleted' });
};
