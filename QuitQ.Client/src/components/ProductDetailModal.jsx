import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export function ProductDetailModal({ product, onClose, onBuyNow }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!product) return null;

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(product.price);

  const originalPrice = Math.round(product.price * 1.18);
  const formattedOriginalPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(originalPrice);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    if (onBuyNow) {
      onBuyNow();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content"
        style={{ maxWidth: '820px', borderRadius: '24px', overflow: 'hidden', padding: 0, position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 10,
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid #e2e8f0',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
          }}
        >
          ✕
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          {/* Product Image Section */}
          <div style={{ background: '#f8fafc', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <img
              src={product.imageUrl}
              alt={product.title}
              style={{ width: '100%', height: '340px', objectFit: 'cover', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
            />
            <div style={{ position: 'absolute', bottom: '24px', left: '24px' }}>
              <span className="badge badge-primary shadow-sm" style={{ padding: '6px 12px', fontSize: '11px' }}>
                📁 {product.categoryName}
              </span>
            </div>
          </div>

          {/* Product Details Section (Image 4, Step 2.3) */}
          <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#2563eb', background: '#eff6ff', padding: '3px 8px', borderRadius: '6px' }}>
                  {product.brand}
                </span>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>SKU: QQ-0{product.id}98</span>
                <span className="badge badge-danger text-[10px]">15% Discount</span>
              </div>

              <h2 style={{ fontSize: '1.35rem', fontWeight: '900', color: '#0f172a', lineHeight: 1.3, marginBottom: '12px' }}>
                {product.title}
              </h2>

              {/* Price & Taxes */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '16px' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: '900', color: '#0f172a' }}>
                  {formattedPrice}
                </span>
                <span style={{ fontSize: '14px', color: '#94a3b8', textDecoration: 'line-through' }}>
                  {formattedOriginalPrice}
                </span>
                <span style={{ fontSize: '11px', color: '#10b981', fontWeight: '700' }}>Inclusive of all GST</span>
              </div>

              {/* Verified Seller Box (Image 4, Step 2.3: Seller name is displayed) */}
              <div style={{ padding: '12px 14px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.05em' }}>Verified Merchant Partner</div>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a' }}>{product.storeName || product.sellerName}</div>
                </div>
                <span className="badge badge-success text-[10px]">✓ Authorized Seller</span>
              </div>

              {/* Detailed Description */}
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '11px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Specifications & Overview</h4>
                <p style={{ fontSize: '12.5px', color: '#475569', lineHeight: 1.6, maxHeight: '120px', overflowY: 'auto' }}>
                  {product.description}
                </p>
              </div>

              {/* Inventory Status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: product.stockQuantity > 0 ? '#10b981' : '#ef4444' }}></span>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>
                  {product.stockQuantity > 0 ? `Ready to Dispatch (${product.stockQuantity} units available)` : 'Temporarily Out of Stock'}
                </span>
              </div>
            </div>

            {/* Quantity Stepper & Dual Action CTA */}
            <div style={{ paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Select Quantity:</span>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden', background: '#f8fafc' }}>
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    style={{ padding: '4px 10px', fontSize: '14px', fontWeight: '800', color: '#475569' }}
                  >
                    -
                  </button>
                  <span style={{ padding: '4px 12px', fontSize: '13px', fontWeight: '800', color: '#0f172a', minWidth: '32px', textAlign: 'center' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stockQuantity, q + 1))}
                    style={{ padding: '4px 10px', fontSize: '14px', fontWeight: '800', color: '#475569' }}
                  >
                    +
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  onClick={handleAddToCart}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    background: addedAnimation ? '#10b981' : '#ffffff',
                    color: addedAnimation ? '#ffffff' : '#2563eb',
                    border: addedAnimation ? '1px solid #10b981' : '2px solid #2563eb',
                    transition: 'all 0.2s'
                  }}
                >
                  {addedAnimation ? (
                    <span>✓ Added to Cart!</span>
                  ) : (
                    <span>🛍️ Add to Cart</span>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="btn btn-primary"
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <span>⚡ Buy Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
