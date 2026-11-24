import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { OrdersHistoryView } from './components/OrdersHistoryView';
import { SellerDashboard } from './components/SellerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';

export function App() {
  const { isCustomer, isSeller, isAdmin } = useAuth();

  // Active view: 'catalog' | 'orders' | 'seller' | 'admin'
  const [activeView, setActiveView] = useState('catalog');

  // Product Catalog & Filter state (Image 4, Step 2.1)
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [availableBrands, setAvailableBrands] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [trackingOrderNumber, setTrackingOrderNumber] = useState(null);

  // Load brands on mount
  useEffect(() => {
    api.getBrands().then(b => setAvailableBrands(b || []));
  }, []);

  // Fetch products whenever filters change
  useEffect(() => {
    fetchFilteredProducts();
  }, [selectedCategory, selectedBrand, minPrice, maxPrice, sortBy, searchTerm]);

  const fetchFilteredProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await api.getProducts({
        categoryName: selectedCategory,
        brand: selectedBrand,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        sortBy: sortBy,
        searchTerm: searchTerm || undefined
      });
      setProducts(res.items || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleSearchSelect = (item) => {
    if (item.type === 'Product' && item.targetId) {
      api.getProductById(item.targetId).then(p => {
        if (p) setSelectedProduct(p);
      });
    } else if (item.type === 'Brand') {
      setSelectedBrand(item.suggestion);
    } else if (item.type === 'Category') {
      setSelectedCategory(item.suggestion);
    } else {
      setSearchTerm(item.suggestion);
    }
  };

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedBrand('All');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navigation Bar with Search and Role Switcher */}
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onSelectProduct={(p) => setSelectedProduct(p)}
        activeView={activeView}
        setActiveView={setActiveView}
        onSearchSelect={handleSearchSelect}
      />

      {/* Main Content Area based on Active View */}
      <main className="flex-1">
        {activeView === 'seller' && isSeller ? (
          <SellerDashboard />
        ) : activeView === 'admin' && isAdmin ? (
          <AdminDashboard />
        ) : activeView === 'orders' ? (
          <OrdersHistoryView
            onTrackOrder={(orderNum) => setTrackingOrderNumber(orderNum)}
            onBackToCatalog={() => setActiveView('catalog')}
          />
        ) : (
          /* Catalog View (Default for Customer) */
          <div>
            {/* Hero Banner with Modern Gradient Aesthetics (Image 4, Step 2) */}
            <div 
              style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%)',
                color: '#ffffff',
                padding: '3rem 1.5rem',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ maxWidth: '680px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', borderRadius: '9999px', marginBottom: '16px' }}>
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#34d399' }}></span>
                    <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#ffffff' }}>QuitQ E-Commerce Hub</span>
                  </div>

                  <h1 style={{ fontSize: '2.5rem', fontWeight: '900', lineHeight: 1.15, letterSpacing: '-0.03em', color: '#ffffff', margin: '0 0 12px' }}>
                    Next-Gen Multi-Vendor Shopping Marketplace
                  </h1>
                  <p style={{ fontSize: '15px', color: '#bfdbfe', lineHeight: 1.6, margin: '0 0 24px' }}>
                    Shop curated flagship mobile devices, high-performance electronics, contemporary fashion, and modern home essentials with predictive search & real-time shipment milestones.
                  </p>
                </div>

                {/* Categories Navigation Bar (Image 4, Step 2: Electronics, Fashion, Mobile, Home & Furniture) */}
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#93c5fd', marginBottom: '10px' }}>
                    Browse Popular Categories:
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    {[
                      { name: 'All', icon: '🛍️', label: 'All Catalog' },
                      { name: 'Electronics', icon: '💻', label: 'Laptops & Audio' },
                      { name: 'Mobile', icon: '📱', label: '5G Smartphones' },
                      { name: 'Fashion', icon: '👟', label: 'Apparel & Kicks' },
                      { name: 'Home & Furniture', icon: '🛋️', label: 'Ergonomic Living' }
                    ].map((cat) => (
                      <button
                        key={cat.name}
                        onClick={() => setSelectedCategory(cat.name)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 18px',
                          borderRadius: '12px',
                          fontSize: '13px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          background: selectedCategory === cat.name ? '#ffffff' : 'rgba(255, 255, 255, 0.12)',
                          color: selectedCategory === cat.name ? '#1e3a8a' : '#ffffff',
                          boxShadow: selectedCategory === cat.name ? '0 10px 20px -5px rgba(0,0,0,0.2)' : 'none',
                          transform: selectedCategory === cat.name ? 'scale(1.04)' : 'none',
                          border: selectedCategory === cat.name ? '2px solid #ffffff' : '1px solid rgba(255,255,255,0.2)'
                        }}
                      >
                        <span style={{ fontSize: '16px' }}>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Value Proposition Strip */}
            <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '14px 0' }}>
              <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', fontSize: '12px', fontWeight: '700', color: '#475569' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>🚚</span>
                  <span>Free Express Delivery above ₹500</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>🛡️</span>
                  <span>100% Verified Merchant Partners</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>⚡</span>
                  <span>Real-time 4-Stage Shipment Tracking</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>🔒</span>
                  <span>256-Bit Encrypted Payments</span>
                </div>
              </div>
            </div>

            {/* Catalog Grid & Filters Sidebar */}
            <div className="container py-8">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filters Sidebar (Image 4, Step 2.1: filters for brands, and price ranges) */}
                <aside className="lg:col-span-1">
                  <div 
                    className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm sticky top-24"
                    style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '16px' }}>⚙️</span>
                        <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>Filters & Sorting</h3>
                      </div>
                      <button
                        onClick={resetFilters}
                        style={{ fontSize: '12px', color: '#2563eb', fontWeight: '700', cursor: 'pointer' }}
                      >
                        Reset All
                      </button>
                    </div>

                    {/* Brand Filter */}
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '8px' }}>
                        Filter by Brand
                      </label>
                      <select
                        value={selectedBrand}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          fontSize: '13px',
                          fontWeight: '600',
                          backgroundColor: '#f8fafc',
                          border: '1px solid #cbd5e1',
                          borderRadius: '10px',
                          color: '#1e293b',
                          outline: 'none'
                        }}
                      >
                        <option value="All">All Brands (Every Merchant)</option>
                        {availableBrands.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>

                    {/* Price Range Filter (Image 4, Step 2.1) */}
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <label style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b' }}>
                          Price Range (₹ INR)
                        </label>
                        {(minPrice || maxPrice) && (
                          <button
                            onClick={() => { setMinPrice(''); setMaxPrice(''); }}
                            style={{ fontSize: '10px', color: '#ef4444', fontWeight: '700', cursor: 'pointer' }}
                          >
                            Reset Price
                          </button>
                        )}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                        <input
                          type="number"
                          placeholder="Min ₹"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            fontSize: '12px',
                            backgroundColor: '#f8fafc',
                            border: minPrice && maxPrice && Number(minPrice) > Number(maxPrice) ? '1px solid #ef4444' : '1px solid #cbd5e1',
                            borderRadius: '10px',
                            outline: 'none'
                          }}
                        />
                        <input
                          type="number"
                          placeholder="Max ₹"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            fontSize: '12px',
                            backgroundColor: '#f8fafc',
                            border: minPrice && maxPrice && Number(minPrice) > Number(maxPrice) ? '1px solid #ef4444' : '1px solid #cbd5e1',
                            borderRadius: '10px',
                            outline: 'none'
                          }}
                        />
                      </div>

                      {/* Conflict Alert */}
                      {minPrice && maxPrice && Number(minPrice) > Number(maxPrice) && (
                        <div style={{ fontSize: '11px', color: '#ef4444', fontWeight: '700', background: '#fef2f2', padding: '6px 8px', borderRadius: '8px', marginBottom: '8px', border: '1px solid #fecdd3' }}>
                          ⚠️ Min Price (₹{Number(minPrice).toLocaleString()}) cannot be greater than Max Price (₹{Number(maxPrice).toLocaleString()}).
                        </div>
                      )}

                      {/* Quick Budget Presets */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {[
                          { label: '< ₹20k', min: '', max: '20000' },
                          { label: '₹20k - ₹50k', min: '20000', max: '50000' },
                          { label: '₹50k - ₹1.5L', min: '50000', max: '150000' },
                          { label: '> ₹1.5L', min: '150000', max: '' }
                        ].map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => { setMinPrice(preset.min); setMaxPrice(preset.max); }}
                            style={{
                              fontSize: '10px',
                              fontWeight: '700',
                              padding: '3px 7px',
                              borderRadius: '6px',
                              background: minPrice === preset.min && maxPrice === preset.max ? '#2563eb' : '#f1f5f9',
                              color: minPrice === preset.min && maxPrice === preset.max ? '#ffffff' : '#475569',
                              cursor: 'pointer'
                            }}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sorting Options */}
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '8px' }}>
                        Sort Products
                      </label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          fontSize: '13px',
                          fontWeight: '600',
                          backgroundColor: '#f8fafc',
                          border: '1px solid #cbd5e1',
                          borderRadius: '10px',
                          color: '#1e293b',
                          outline: 'none'
                        }}
                      >
                        <option value="newest">Featured / Newest First</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                        <option value="title">Alphabetical (A - Z)</option>
                      </select>
                    </div>
                  </div>
                </aside>

                {/* Product Grid Area */}
                <div className="lg:col-span-3">
                  {/* Results Count & Active Tags */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>
                      Showing <strong style={{ color: '#0f172a' }}>{products.length}</strong> items
                      {selectedCategory !== 'All' && <span> in <strong style={{ color: '#2563eb' }}>{selectedCategory}</strong></span>}
                      {selectedBrand !== 'All' && <span> by <strong style={{ color: '#2563eb' }}>{selectedBrand}</strong></span>}
                      {searchTerm && <span> matching "<strong style={{ color: '#0f172a' }}>{searchTerm}</strong>"</span>}
                    </div>

                    {(selectedCategory !== 'All' || selectedBrand !== 'All' || searchTerm || minPrice || maxPrice) && (
                      <button
                        onClick={resetFilters}
                        className="badge badge-slate"
                        style={{ cursor: 'pointer', padding: '4px 10px' }}
                      >
                        ✕ Clear Filters
                      </button>
                    )}
                  </div>

                  {loadingProducts ? (
                    <div style={{ padding: '4rem 0', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
                      <div className="animate-spin" style={{ width: '32px', height: '32px', border: '3px solid #cbd5e1', borderTopColor: '#2563eb', borderRadius: '50%', margin: '0 auto 12px' }}></div>
                      Loading catalog items...
                    </div>
                  ) : products.length === 0 ? (
                    <div style={{ background: '#ffffff', borderRadius: '16px', padding: '3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                      <div style={{ width: '64px', height: '64px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '28px' }}>
                        🔍
                      </div>
                      <h4 style={{ fontWeight: '800', color: '#1e293b', fontSize: '16px', marginBottom: '4px' }}>
                        {minPrice && maxPrice && Number(minPrice) > Number(maxPrice)
                          ? "Price Filter Conflict"
                          : "No products match your criteria"}
                      </h4>
                      <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '360px', margin: '0 auto 16px', lineHeight: 1.5 }}>
                        {minPrice && maxPrice && Number(minPrice) > Number(maxPrice)
                          ? `Your Min Price (₹${Number(minPrice).toLocaleString()}) is higher than Max Price (₹${Number(maxPrice).toLocaleString()}). Please adjust the numbers or click below.`
                          : "Try loosening filters, selecting 'All' brands, or clicking 'Show All Products' below."}
                      </p>
                      <button onClick={resetFilters} className="btn btn-primary btn-sm">
                        Show All Products (Clear Filters)
                      </button>
                    </div>
                  ) : (
                    <div 
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                        gap: '20px'
                      }}
                    >
                      {products.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onSelect={(p) => setSelectedProduct(p)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ background: '#0f172a', color: '#94a3b8', fontSize: '12px', padding: '2rem 0', borderTop: '1px solid #1e293b', marginTop: 'auto' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#2563eb', color: '#ffffff', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>Q</div>
            <span style={{ fontWeight: '800', color: '#ffffff', fontSize: '15px' }}>QuitQ Fullstack E-Commerce</span>
            <span style={{ color: '#64748b' }}>| Hexaware Technologies Case Study Reference Solution</span>
          </div>
          <div style={{ color: '#64748b', textAlign: 'center' }}>
            Engineered with ASP.NET Core 10 Web API, Entity Framework Core, Microsoft SQL Server, and React 19 Client
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onBuyNow={() => {
          setSelectedProduct(null);
          setIsCheckoutOpen(true);
        }}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderPlaced={(order) => {
          setTrackingOrderNumber(order.orderNumber);
        }}
      />

      <OrderTrackingModal
        orderNumber={trackingOrderNumber}
        onClose={() => setTrackingOrderNumber(null)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
}

export default App;
