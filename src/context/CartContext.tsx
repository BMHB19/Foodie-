import React, { createContext, useContext, useState, useEffect } from 'react';
import { FoodItem, CartItem, PromoCode } from '../types';

export const AVAILABLE_COUPONS: PromoCode[] = [
  {
    code: 'FOODIE50',
    discountPercent: 50,
    maxDiscount: 100,
    minOrder: 199,
    description: '50% off up to ₹100 on orders above ₹199',
  },
  {
    code: 'WELCOME20',
    discountPercent: 20,
    minOrder: 149,
    description: '20% flat discount on orders above ₹149',
  },
  {
    code: 'FEAST75',
    flatDiscount: 75,
    minOrder: 399,
    description: 'Flat ₹75 discount on orders above ₹399',
  },
];

interface CartContextType {
  items: CartItem[];
  addToCart: (food: FoodItem, quantity?: number) => void;
  updateQuantity: (foodId: string, quantity: number) => void;
  removeFromCart: (foodId: string) => void;
  clearCart: () => void;
  getItemQuantity: (foodId: string) => number;
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  totalAmount: number;
  appliedCoupon: PromoCode | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('foodiehub_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<PromoCode | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('foodiehub_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (food: FoodItem, quantity: number = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.food._id === food._id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }
      return [...prev, { food, quantity }];
    });
  };

  const updateQuantity = (foodId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(foodId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.food._id === foodId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (foodId: string) => {
    setItems((prev) => prev.filter((item) => item.food._id !== foodId));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const getItemQuantity = (foodId: string): number => {
    const found = items.find((item) => item.food._id === foodId);
    return found ? found.quantity : 0;
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.food.price * item.quantity, 0);

  // Delivery fee: Free for orders >= 399, else 40
  const deliveryFee = subtotal === 0 ? 0 : subtotal >= 399 ? 0 : 40;

  // 5% GST tax
  const tax = subtotal === 0 ? 0 : Math.round(subtotal * 0.05);

  // Discount calculation
  let discount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minOrder) {
    if (appliedCoupon.discountPercent) {
      const raw = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
      discount = appliedCoupon.maxDiscount ? Math.min(raw, appliedCoupon.maxDiscount) : raw;
    } else if (appliedCoupon.flatDiscount) {
      discount = appliedCoupon.flatDiscount;
    }
  }

  const totalAmount = Math.max(0, subtotal + deliveryFee + tax - discount);

  const applyCoupon = (code: string) => {
    const formatted = code.trim().toUpperCase();
    const coupon = AVAILABLE_COUPONS.find((c) => c.code === formatted);

    if (!coupon) {
      return { success: false, message: 'Invalid promo code' };
    }

    if (subtotal < coupon.minOrder) {
      return {
        success: false,
        message: `Cart total must be at least ₹${coupon.minOrder} to use this coupon`,
      };
    }

    setAppliedCoupon(coupon);
    return { success: true, message: `Coupon ${coupon.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getItemQuantity,
        itemCount,
        subtotal,
        deliveryFee,
        tax,
        discount,
        totalAmount,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        isCartOpen,
        setIsCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
