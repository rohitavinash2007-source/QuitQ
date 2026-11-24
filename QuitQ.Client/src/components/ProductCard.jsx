import React from 'react';
import { useCart } from '../context/CartContext';

export function ProductCard({ product, onSelect }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(product.price);

  // Computed discount for realistic e-commerce appearance
  const originalPrice = Math.round(product.price * 1.18);
  const formattedOriginalPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(originalPrice);

  return (
    <div 
      onClick={() => onSelect(product)}
      className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col cursor-pointer group relative"
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      {/* Product Image Container */}
      <div 
        className="relative bg-slate-100 overflow-hidden"
        style={{ aspectRatio: '1/1', position: 'relative' }}
      >
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
        />

        {/* Category & Stock Badges */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span className="badge badge-primary shadow-sm">
            {product.categoryName}
          </span>
          {product.stockQuantity < 10 ? (
            <span className="badge badge-warning shadow-sm">
              Only {product.stockQuantity} left
            </span>
          ) : (
            <span className="badge badge-success shadow-sm">
              In Stock
            </span>
          )}
        </div>

        {/* Quick Discount Pill */}
        <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
          <span className="badge badge-danger shadow-sm">
            15% OFF
          </span>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-5 flex-1 flex flex-col justify-between" style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '1.25rem' }}>
        <div>
          {/* Brand & Rating */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
              <span className="text-amber-500">★</span>
              <span>4.8</span>
              <span className="text-slate-400 font-normal">(120+)</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition mb-1.5">
            {product.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
            {product.description}
          </p>
        </div>

        {/* Pricing, Verified Merchant & Add to Cart button */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-slate-900 tracking-tight">
                {formattedPrice}
              </span>
              <span className="text-xs text-slate-400 line-through">
                {formattedOriginalPrice}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 truncate max-w-[140px] mt-0.5">
              Sold by <strong className="text-slate-700 font-semibold">{product.storeName || product.sellerName}</strong>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="btn btn-primary btn-sm rounded-xl px-3.5 py-2 flex items-center gap-1.5 shadow-sm active:scale-95"
            title="Add to Cart"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
