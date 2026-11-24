import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

export function Navbar({ onOpenCart, onOpenAuth, onSelectProduct, activeView, setActiveView, onSearchSelect }) {
  const { user, isAuthenticated, logout, switchDemoRole, isCustomer, isSeller, isAdmin } = useAuth();
  const { totalCount } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // Live Auto-Suggestions & Predictive Search (Image 4, Step 2.2)
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await api.getAutoSuggestions(searchQuery);
        setSuggestions(res || []);
        setShowSuggestions(true);
      } catch (e) {
        setSuggestions([]);
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listener for auto-suggestions
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionClick = (item) => {
    setShowSuggestions(false);
    setSearchQuery(item.suggestion);
    if (onSearchSelect) {
      onSearchSelect(item);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (onSearchSelect) {
      onSearchSelect({ suggestion: searchQuery, type: 'Query' });
    }
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255, 255, 255, 0.98)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      {/* Top Demo Account Quick Switcher Banner */}
      <div style={{ background: '#090d16', color: '#cbd5e1', fontSize: '11px', padding: '6px 1rem', borderBottom: '1px solid #1e293b' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#34d399', padding: '2px 8px', borderRadius: '9999px', fontSize: '10px', fontWeight: '800' }}>
              <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} className="animate-pulse"></span>
              Backend API Connected: Port 5000
            </span>
            <span style={{ fontWeight: '800', color: '#ffffff' }}>Evaluation Persona:</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => switchDemoRole('Customer')}
              style={{
                padding: '3px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.15s',
                background: user?.role === 'Customer' ? '#2563eb' : '#1e293b',
                color: '#ffffff',
                border: user?.role === 'Customer' ? '1px solid #60a5fa' : '1px solid transparent'
              }}
            >
              👤 Customer (Buyer)
            </button>
            <button
              onClick={() => switchDemoRole('Seller')}
              style={{
                padding: '3px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.15s',
                background: user?.role === 'Seller' ? '#d97706' : '#1e293b',
                color: '#ffffff',
                border: user?.role === 'Seller' ? '1px solid #fbbf24' : '1px solid transparent'
              }}
            >
              🏪 Seller Central
            </button>
            <button
              onClick={() => switchDemoRole('Admin')}
              style={{
                padding: '3px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.15s',
                background: user?.role === 'Admin' ? '#7e22ce' : '#1e293b',
                color: '#ffffff',
                border: user?.role === 'Admin' ? '1px solid #c084fc' : '1px solid transparent'
              }}
            >
              ⚡ Administrator
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="container" style={{ padding: '10px 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveView('catalog')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none' }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: '900',
              fontSize: '22px',
              boxShadow: '0 4px 10px rgba(37,99,235,0.35)'
            }}>
              Q
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '22px', fontWeight: '900', letterSpacing: '-0.03em', color: '#0f172a' }}>Quit<span style={{ color: '#2563eb' }}>Q</span></span>
                <span className="badge badge-primary" style={{ padding: '2px 6px', fontSize: '10px' }}>2.0</span>
              </div>
              <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', margin: 0, lineHeight: 1 }}>E-Commerce Marketplace</p>
            </div>
          </div>

          {/* Search Bar with Predictive Text Auto-Suggestions (Image 4, Step 2.2) */}
          <div style={{ flex: 1, maxWidth: '580px', position: 'relative' }} ref={searchRef}>
            <form onSubmit={handleSearchSubmit} style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                placeholder="Search products, brands, or categories with predictive auto-suggestions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                style={{
                  width: '100%',
                  padding: '11px 90px 11px 40px',
                  background: '#f1f5f9',
                  fontSize: '13px',
                  fontWeight: '500',
                  borderRadius: '9999px',
                  border: '1px solid transparent',
                  outline: 'none',
                  color: '#0f172a',
                  transition: 'all 0.2s',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                }}
                onMouseEnter={(e) => e.target.style.background = '#f8fafc'}
                onMouseLeave={(e) => !document.activeElement.isSameNode(e.target) && (e.target.style.background = '#f1f5f9')}
                onFocus={(e) => { e.target.style.background = '#ffffff'; e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 4px rgba(37,99,235,0.15)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'transparent'; e.target.style.boxShadow = 'none'; e.target.style.background = '#f1f5f9'; }}
              />
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#94a3b8' }}>
                🔍
              </span>
              <button
                type="submit"
                style={{
                  position: 'absolute',
                  right: '6px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  padding: '7px 16px',
                  background: '#2563eb',
                  color: '#ffffff',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Search
              </button>
            </form>

            {/* Predictive Auto-Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="suggestions-dropdown animate-fadeIn">
                <div style={{ padding: '8px 14px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Auto-Suggested Matches
                </div>
                {suggestions.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSuggestionClick(item)}
                    className="suggestion-item"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '14px' }}>
                        {item.type === 'Product' ? '📦' : item.type === 'Brand' ? '🏷️' : '📁'}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                        {item.suggestion}
                      </span>
                    </div>
                    <span className="badge badge-slate" style={{ fontSize: '10px' }}>
                      {item.type}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Nav Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* View Mode Switching Tabs */}
            {isCustomer && (
              <button
                onClick={() => setActiveView('orders')}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  background: activeView === 'orders' ? '#eff6ff' : 'transparent',
                  color: activeView === 'orders' ? '#2563eb' : '#475569'
                }}
              >
                📦 My Orders
              </button>
            )}

            {isSeller && (
              <button
                onClick={() => setActiveView('seller')}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: activeView === 'seller' ? '#fffbeb' : 'transparent',
                  color: activeView === 'seller' ? '#d97706' : '#475569'
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}></span>
                Seller Portal
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => setActiveView('admin')}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: activeView === 'admin' ? '#faf5ff' : 'transparent',
                  color: activeView === 'admin' ? '#9333ea' : '#475569'
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#a855f7' }}></span>
                Admin Portal
              </button>
            )}

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              style={{
                position: 'relative',
                padding: '10px',
                background: '#f1f5f9',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#1e293b'
              }}
              title="Shopping Cart"
            >
              <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalCount > 0 && (
                <span 
                  style={{
                    position: 'absolute',
                    top: '-3px',
                    right: '-3px',
                    background: '#2563eb',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: '900',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 5px rgba(37,99,235,0.4)'
                  }}
                  className="animate-bounce"
                >
                  {totalCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth */}
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '8px', borderLeft: '1px solid #e2e8f0' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: '#0f172a', lineHeight: 1.2 }}>{user.fullName}</div>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'capitalize' }}>{user.role}</div>
                </div>
                <button
                  onClick={logout}
                  style={{
                    padding: '8px',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    borderRadius: '8px'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = '#fff1f2'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent'; }}
                  title="Logout"
                >
                  <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="btn btn-primary btn-sm"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
