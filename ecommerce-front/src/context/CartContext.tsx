import React, { createContext, useContext, useState } from "react";
import type { CartItem } from "../types";
import { safeArray } from "../utils";
import {
  CART_LOCAL_KEY,
  CART_COUNT_CACHE_KEY,
} from "../constants";

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  addToCart: (product: Omit<CartItem, "quantity">) => void;
  removeFromCart: (productId: number) => void;
  removeProductFromCart: (productId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Read the cart from localStorage on startup.
const loadCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(CART_LOCAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// Persist the cart to localStorage and update the count badge cache.
const saveCart = (cart: CartItem[]) => {
  localStorage.setItem(CART_LOCAL_KEY, JSON.stringify(cart));
  localStorage.setItem(
    CART_COUNT_CACHE_KEY,
    String(cart.reduce((sum, item) => sum + item.quantity, 0))
  );
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>(loadCart);

  const updateCart = (next: CartItem[]) => {
    saveCart(next);
    setCart(next);
  };

  const addToCart = (product: Omit<CartItem, "quantity">) => {
    const existing = safeArray<CartItem>(cart).find((item) => item.id === product.id);
    const next = existing
      ? safeArray<CartItem>(cart).map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [...safeArray<CartItem>(cart), { ...product, quantity: 1 }];
    updateCart(next);
  };

  // Decrease quantity by 1, remove the item if it reaches 0.
  const removeFromCart = (productId: number) => {
    const next = safeArray<CartItem>(cart)
      .map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);
    updateCart(next);
  };

  // Remove a product entirely regardless of quantity.
  const removeProductFromCart = (productId: number) => {
    updateCart(safeArray<CartItem>(cart).filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    localStorage.removeItem(CART_LOCAL_KEY);
    localStorage.setItem(CART_COUNT_CACHE_KEY, "0");
    setCart([]);
  };

  const cartCount = safeArray<CartItem>(cart).reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        addToCart,
        removeFromCart,
        removeProductFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
};

// Re-export CartItem so consumers can import it from here if needed.
export type { CartItem };