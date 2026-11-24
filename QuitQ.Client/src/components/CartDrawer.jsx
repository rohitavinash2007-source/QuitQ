import React from 'react';
import { useCart } from '../context/CartContext';

export function CartDrawer({ isOpen, onClose, onProceedToCheckout }) {
  const { items, totalCount, totalAmount, shippingFee, grandTotal, updateQuantity, removeFromCart, clearCart } = useCart();

  if (!isOpen) return null;

  const formatPrice = (val) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);

  const amountForFreeShipping = Math.max(0, 500 - totalAmount);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content"
        style={{
          maxWidth: '440px',
          height: '92vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 0,
          borderRadius: '24px',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>🛍️</span>
            <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#0f172a', margin: 0 }}>Shopping Cart</h3>
            <span className="badge badge-primary" style={{ padding: '2px 8px', fontSize: '11px' }}>{totalCount} items</span>
          </div>
          <button
            onClick={onClose}
            style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        {/* Free Shipping Alert Bar */}
        <div style={{ padding: '10px 1.5rem', background: amountForFreeShipping === 0 ? '#ecfdf5' : '#eff6ff', borderBottom: '1px solid #e2e8f0', fontSize: '12px', fontWeight: '700', color: amountForFreeShipping === 0 ? '#065f46' : '#1e40af', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>{amountForFreeShipping === 0 ? '🎉' : '🚚'}</span>
          <span>
            {amountForFreeShipping === 0 
              ? 'Congratulations! You unlocked FREE Delivery.' 
              : `Add ${formatPrice(amountForFreeShipping)} more to qualify for FREE Delivery!`}
          </span>
        </div>

        {/* Cart Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {items.length === 0 ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#94a3b8' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', marginBottom: '12px' }}>
                🛒
              </div>
              <h4 style={{ fontWeight: '800', color: '#1e293b', fontSize: '15px', marginBottom: '4px' }}>Your shopping cart is empty</h4>
              <p style={{ fontSize: '12px', color: '#64748b', maxWidth: '240px' }}>Explore top-rated items from verified sellers and add them to your cart.</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.productId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover', background: '#f8fafc', flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', color: '#2563eb' }}>{item.brand}</div>
                  <h4 style={{ fontSize: '12.5px', fontWeight: '700', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: '2px 0' }}>{item.title}</h4>
                  <div style={{ fontSize: '13px', fontWeight: '900', color: '#0f172a' }}>
                    {formatPrice(item.unitPrice)}
                  </div>
                  
                  {/* Quantity controls */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden', background: '#f8fafc' }}>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        style={{ padding: '2px 8px', fontSize: '12px', fontWeight: '800', color: '#475569', cursor: 'pointer' }}
                      >
                        -
                      </button>
                      <span style={{ padding: '2px 8px', fontSize: '12px', fontWeight: '800', color: '#0f172a' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        style={{ padding: '2px 8px', fontSize: '12px', fontWeight: '800', color: '#475569', cursor: 'pointer' }}
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.productId)}
                      style={{ fontSize: '11px', color: '#ef4444', fontWeight: '700', cursor: 'pointer' }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Summary */}
        {items.length > 0 && (
          <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#475569', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal ({totalCount} items):</span>
                <span style={{ fontWeight: '700', color: '#0f172a' }}>{formatPrice(totalAmount)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Delivery Fee:</span>
                <span style={{ fontWeight: '700', color: shippingFee === 0 ? '#10b981' : '#0f172a' }}>
                  {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: '900', color: '#0f172a', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
                <span>Grand Total:</span>
                <span style={{ color: '#2563eb' }}>{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={clearCart}
                className="btn btn-outline"
                style={{ fontSize: '12px', padding: '10px 14px' }}
              >
                Clear
              </button>
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="btn btn-primary"
                style={{ flex: 1, padding: '12px', fontSize: '13px', fontWeight: '800' }}
              >
                Proceed to Checkout ({formatPrice(grandTotal)})
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
