import { useState } from "react";
import type { ReactNode } from "react";
import { CartContext } from "./cart.context";
import type { MenuItem } from "../services/api";
import type { CartItem } from "./cart.context";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find(
        (ci) => ci.menuItem._id === item._id
      );

      if (existing) {
        return prev.map((ci) =>
          ci.menuItem._id === item._id
            ? { ...ci, quantity: ci.quantity + 1 }
            : ci
        );
      }

      return [...prev, { menuItem: item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) =>
      prev.filter((ci) => ci.menuItem._id !== id)
    );
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCart((prev) =>
      prev.map((ci) =>
        ci.menuItem._id === id ? { ...ci, quantity } : ci
      )
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
