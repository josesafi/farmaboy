"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { wompiConfig } from "@/config/wompi";
import { useAdminStore } from "./AdminStoreContext";
import { useAuth } from "./AuthContext";
import { PromotionRule } from "@/types/admin";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  priceDisplay: string;
  quantity: number;
  imageUrl: string;
  category: string;
  sku?: string;
  maxAvailableStock?: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (
    product: {
      id: string;
      name: string;
      price: number;
      priceDisplay?: string;
      imageUrl: string;
      category: string;
      sku?: string;
    },
    quantity?: number
  ) => boolean;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalItems: number;
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  couponDiscountAmount: number;
  lifetimeDiscountPercentage: number;
  lifetimeDiscountAmount: number;
  lifetimeDiscountReason: string;
  appliedCoupon: PromotionRule | null;
  couponError: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  total: number;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "farmaboy_cart_v2";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const {
    medicines,
    retailProducts,
    storeSettings,
    getActiveShippingRate,
    validatePromotionCode,
    showToast,
    getCustomerLifetimeDiscount,
  } = useAdminStore();

  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const [appliedCoupon, setAppliedCoupon] = useState<PromotionRule | null>(null);
  const [couponDiscountAmount, setCouponDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Could not load cart from localStorage", e);
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Could not save cart to localStorage", e);
    }
  }, [items, isHydrated]);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Lifetime discount evaluation for logged-in user profile
  const customerLifetime = React.useMemo(() => {
    if (user) {
      const fromCrm = getCustomerLifetimeDiscount({
        email: user.email,
        documentNumber: user.documentNumber,
        id: user.id,
      });
      if (fromCrm) return fromCrm;
      if (user.lifetimeDiscountPercentage && user.lifetimeDiscountPercentage > 0) {
        return {
          percentage: user.lifetimeDiscountPercentage,
          reason: user.lifetimeDiscountReason || `Descuento Vitalicio (${user.lifetimeDiscountPercentage}%)`,
        };
      }
    }
    return null;
  }, [user, getCustomerLifetimeDiscount]);

  const lifetimeDiscountPercentage = customerLifetime?.percentage || 0;
  const lifetimeDiscountReason = customerLifetime?.reason || "";
  const lifetimeDiscountAmount = Math.round((subtotal * lifetimeDiscountPercentage) / 100);
  const discountAmount = lifetimeDiscountAmount + couponDiscountAmount;

  // Revalidate coupon if subtotal changes
  useEffect(() => {
    if (appliedCoupon) {
      const res = validatePromotionCode(appliedCoupon.code, subtotal);
      if (!res.isValid) {
        setAppliedCoupon(null);
        setCouponDiscountAmount(0);
        setCouponError(`El cupón "${appliedCoupon.code}" ya no aplica: ${res.message}`);
      } else {
        setCouponDiscountAmount(res.discountAmount);
        setCouponError(null);
      }
    }
  }, [subtotal, appliedCoupon, validatePromotionCode]);

  const addItem = (
    product: {
      id: string;
      name: string;
      price: number;
      priceDisplay?: string;
      imageUrl: string;
      category: string;
      sku?: string;
    },
    quantity = 1
  ): boolean => {
    // 1. Cross-reference in medicines or retail products from AdminStore
    const med = medicines.find((m) => m.id === product.id);
    const retail = retailProducts.find((p) => p.id === product.id);
    const catalogItem = med || retail;

    // Check if expired (INVIMA rule)
    if (med && med.expiryDate) {
      const exp = new Date(med.expiryDate);
      if (exp < new Date()) {
        showToast(`"${med.name}" está vencido según normativa INVIMA y no puede comercializarse.`, "error");
        return false;
      }
    }

    const availableStock = catalogItem !== undefined ? catalogItem.currentStock : 999;
    if (availableStock <= 0) {
      showToast(`"${product.name}" se encuentra actualmente agotado.`, "warning");
      return false;
    }

    const existing = items.find((item) => item.id === product.id);
    const currentInCart = existing ? existing.quantity : 0;
    const requestedTotal = currentInCart + quantity;

    if (requestedTotal > availableStock) {
      const allowedToAdd = Math.max(0, availableStock - currentInCart);
      if (allowedToAdd <= 0) {
        showToast(`Ya tienes en el carrito las ${availableStock} unidades disponibles de "${product.name}".`, "warning");
        return false;
      }
      showToast(`Solo se agregaron ${allowedToAdd} unidad(es). Stock máximo disponible: ${availableStock}.`, "warning");

      setItems((prev) =>
        prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: availableStock, maxAvailableStock: availableStock }
            : item
        )
      );
      setIsCartOpen(true);
      return true;
    }

    const activePrice = catalogItem
      ? (catalogItem.priceCOP ?? (catalogItem as any).salePriceCOP ?? product.price ?? 15000)
      : product.price || 15000;

    setItems((prev) => {
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                price: activePrice,
                priceDisplay: wompiConfig.formatCOP(activePrice),
                quantity: item.quantity + quantity,
                maxAvailableStock: availableStock,
              }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: catalogItem?.name || product.name,
          price: activePrice,
          priceDisplay: wompiConfig.formatCOP(activePrice),
          quantity,
          imageUrl: catalogItem?.imageUrl || product.imageUrl,
          category: product.category,
          sku: catalogItem?.sku || product.sku,
          maxAvailableStock: availableStock,
        },
      ];
    });
    setIsCartOpen(true);
    return true;
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    const med = medicines.find((m) => m.id === id);
    const retail = retailProducts.find((p) => p.id === id);
    const catalogItem = med || retail;
    const availableStock = catalogItem !== undefined ? catalogItem.currentStock : 999;

    if (quantity > availableStock) {
      showToast(`Solo disponemos de ${availableStock} unidades de "${catalogItem?.name || "este producto"}".`, "warning");
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity: availableStock } : item))
      );
      return;
    }

    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setCouponDiscountAmount(0);
    setCouponError(null);
  };

  const applyCoupon = (code: string): boolean => {
    const res = validatePromotionCode(code, subtotal);
    if (!res.isValid) {
      setCouponError(res.message);
      showToast(res.message, "error");
      return false;
    }
    setAppliedCoupon(res.promotion || null);
    setCouponDiscountAmount(res.discountAmount);
    setCouponError(null);
    showToast(res.message, "success");
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscountAmount(0);
    setCouponError(null);
    showToast("Cupón removido", "info");
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const freeThreshold = storeSettings.freeShippingThresholdCOP || wompiConfig.shipping.freeShippingThreshold;
  const isFreeShippingByPromo = appliedCoupon?.type === "FREE_SHIPPING";
  const standardCost = storeSettings.standardShippingCostCOP || getActiveShippingRate("Duitama");
  const shippingCost =
    subtotal === 0 || subtotal >= freeThreshold || isFreeShippingByPromo
      ? 0
      : standardCost;

  const total = Math.max(0, subtotal - discountAmount) + shippingCost;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalItems,
        subtotal,
        shippingCost,
        discountAmount,
        couponDiscountAmount,
        lifetimeDiscountPercentage,
        lifetimeDiscountAmount,
        lifetimeDiscountReason,
        appliedCoupon,
        couponError,
        applyCoupon,
        removeCoupon,
        total,
        isCheckoutOpen,
        setIsCheckoutOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
