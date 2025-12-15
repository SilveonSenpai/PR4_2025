import { createContext } from "react";
import type { MenuItem } from "../services/api";

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType | null>(null);
