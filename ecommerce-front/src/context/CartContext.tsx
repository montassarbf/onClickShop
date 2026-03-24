import React, { createContext, useContext, useState } from "react";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  addToCart: (product: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: number) => void;
  removeProductFromCart: (productId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = "cart_items";

// ✅ Lire le panier depuis localStorage au démarrage
const loadCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// ✅ Sauvegarder le panier dans localStorage
const saveCart = (cart: CartItem[]) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  localStorage.setItem("cart_count_cache", String(cart.reduce((s, p) => s + p.quantity, 0)));
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ✅ Initialiser depuis localStorage → pas de rechargement au refresh
  const [cart, setCart] = useState<CartItem[]>(loadCart);

  const updateCart = (next: CartItem[]) => {
    saveCart(next);
    setCart(next);
  };

  const addToCart = (product: Omit<CartItem, "quantity">) => {
    const exist = cart.find(p => p.id === product.id);
    const next = exist
      ? cart.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p)
      : [...cart, { ...product, quantity: 1 }];
    updateCart(next);
  };

  const removeFromCart = (productId: number) => {
    const next = cart
      .map(p => p.id === productId ? { ...p, quantity: p.quantity - 1 } : p)
      .filter(p => p.quantity > 0);
    updateCart(next);
  };

  const removeProductFromCart = (productId: number) => {
    updateCart(cart.filter(p => p.id !== productId));
  };

  const clearCart = () => {
    localStorage.removeItem(CART_KEY);
    localStorage.setItem("cart_count_cache", "0");
    setCart([]);
  };

  const cartCount = cart.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, cartCount, addToCart, removeFromCart, removeProductFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
};