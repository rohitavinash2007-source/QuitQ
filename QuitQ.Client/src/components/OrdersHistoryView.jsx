import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export function OrdersHistoryView({ onTrackOrder, onBackToCatalog }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getMyOrders();
      setOrders(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (val) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);

  return (
    <div className="container py-8" style={{ maxWidth: '900px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>📦</span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#0f172a', margin: 0 }}>Your Order History</h2>
          </div>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>View order receipts, seller information, and track package delivery milestones.</p>
        </div>
        <button
          onClick={onBackToCatalog}
          className="btn btn-outline btn-sm"
          style={{ fontSize: '12px', padding: '8px 16px', borderRadius: '10px' }}
        >
          &larr; Return to Shopping
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '4rem 0', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>Loading past orders...</div>
      ) : orders.length === 0 ? (
        <div style={{ background: '#ffffff', borderRadius: '20px', padding: '3.5rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
          <div style={{ width: '64px', height: '64px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '28px' }}>
            🛍️
          </div>
          <h4 style={{ fontWeight: '800', color: '#0f172a', fontSize: '16px', marginBottom: '4px' }}>No orders placed yet</h4>
          <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '320px', margin: '0 auto 16px' }}>Orders you place will appear here with live tracking checkpoints.</p>
          <button onClick={onBackToCatalog} className="btn btn-primary btn-sm">
            Browse Products Catalog
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map((order) => (
            <div 
              key={order.id} 
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
              }}
            >
              {/* Order Header */}
              <div style={{ padding: '14px 18px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', fontSize: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div>
                    <span style={{ color: '#64748b' }}>Order Number: </span>
                    <strong style={{ color: '#0f172a' }}>{order.orderNumber}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Date: </span>
                    <strong style={{ color: '#334155' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className={`badge ${
                    order.orderStatus === 'Delivered' ? 'badge-success' :
                    order.orderStatus === 'Shipped' ? 'badge-primary' :
                    order.orderStatus === 'Processing' ? 'badge-warning' : 'badge-slate'
                  }`}>
                    {order.orderStatus}
                  </span>
                  <button
                    onClick={() => onTrackOrder(order.orderNumber)}
                    className="btn btn-primary btn-sm"
                    style={{ fontSize: '11px', padding: '6px 14px' }}
                  >
                    Track Package
                  </button>
                </div>
              </div>

              {/* Order Items List */}
              <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {order.items?.map((item) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <img
                      src={item.productImage}
                      alt={item.productTitle}
                      style={{ width: '56px', height: '56px', borderRadius: '12px', objectFit: 'cover', background: '#f8fafc', flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', color: '#2563eb' }}>{item.brand}</div>
                      <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: '2px 0' }}>{item.productTitle}</h4>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        Qty: <strong style={{ color: '#0f172a' }}>{item.quantity}</strong> &times; {formatPrice(item.unitPrice)}
                      </div>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '900', color: '#0f172a' }}>
                      {formatPrice(item.totalPrice)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div style={{ padding: '12px 18px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: '#64748b' }}>
                  Delivery to: <strong style={{ color: '#334155' }}>{order.shippingAddress}</strong>
                </span>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a' }}>
                  Total: <span style={{ color: '#2563eb', fontWeight: '900' }}>{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
