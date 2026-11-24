import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('quitq_mock_cart');
    return saved ? JSON.parse(saved) : [
      {
        productId: 1,
        title: "Apple iPhone 15 Pro Max 256GB Titanium",
        brand: "Apple",
        imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80",
        unitPrice: 134999.00,
        quantity: 1,
        availableStock: 24,
        sellerName: "Apex Tech Traders"
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('quitq_mock_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product, quantity = 1) => {
    setItems(prev => {
      const idx = prev.findIndex(item => item.productId === product.id);
      if (idx > -1) {
        const updated = [...prev];
        const newQty = updated[idx].quantity + quantity;
        updated[idx].quantity = Math.min(newQty, product.stockQuantity || 99);
        return updated;
      } else {
        return [...prev, {
          productId: product.id,
          title: product.title,
          brand: product.brand,
          imageUrl: product.imageUrl,
          unitPrice: product.price,
          quantity: quantity,
          availableStock: product.stockQuantity,
          sellerName: product.sellerName || "QuitQ Partner"
        }];
      }
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev => prev.map(item => {
      if (item.productId === productId) {
        return { ...item, quantity: Math.min(quantity, item.availableStock || 99) };
      }
      return item;
    }));
  };

  const removeFromCart = (productId) => {
    setItems(prev => prev.filter(item => item.productId !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const shippingFee = totalAmount > 500 ? 0 : (totalAmount > 0 ? 50 : 0);
  const grandTotal = totalAmount + shippingFee;

  return (
    <CartContext.Provider value={{
      items,
      totalCount,
      totalAmount,
      shippingFee,
      grandTotal,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
