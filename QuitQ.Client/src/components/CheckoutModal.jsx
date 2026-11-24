import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export function CheckoutModal({ isOpen, onClose, onOrderPlaced }) {
  const { items, totalAmount, shippingFee, grandTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [shippingAddress, setShippingAddress] = useState(user?.address || "Flat 304, Green Heights, Indiranagar, Bangalore - 560038");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  if (!isOpen) return null;

  const formatPrice = (val) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const order = await api.checkout({
        shippingAddress,
        paymentMethod
      });
      clearCart();
      setCompletedOrder(order);
      if (onOrderPlaced) {
        onOrderPlaced(order);
      }
    } catch (err) {
      alert("Error placing order: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content"
        style={{ maxWidth: '520px', padding: '2rem', borderRadius: '24px', position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#f1f5f9',
            border: 'none',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          ✕
        </button>

        {completedOrder ? (
          /* Order Confirmation Screen (Image 1: Order Confirmation) */
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{
              width: '68px',
              height: '68px',
              background: '#d1fae5',
              color: '#059669',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '32px'
            }}>
              ✓
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#0f172a', marginBottom: '6px' }}>Payment & Order Confirmed!</h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>Your shipment is registered and will be dispatched by verified sellers.</p>

            <div style={{ padding: '16px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Order Number:</span>
                <strong style={{ color: '#0f172a' }}>{completedOrder.orderNumber}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Tracking ID (AWB):</span>
                <strong style={{ color: '#2563eb' }}>{completedOrder.trackingNumber}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Total Paid:</span>
                <strong style={{ color: '#0f172a' }}>{formatPrice(completedOrder.totalAmount)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Delivery Address:</span>
                <span style={{ color: '#334155', maxWidth: '240px', textAlign: 'right' }}>{completedOrder.shippingAddress}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid #e2e8f0' }}>
                <span style={{ color: '#64748b' }}>Status:</span>
                <span className="badge badge-success text-[10px]">Payment Completed</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '13px', fontWeight: '800' }}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          /* Checkout & Payment Form */
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '20px' }}>💳</span>
              <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#0f172a', margin: 0 }}>Checkout & Payment</h3>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>Review shipping address and choose your preferred payment option.</p>

            <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Shipping Address */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', marginBottom: '6px' }}>
                  Shipping & Delivery Address
                </label>
                <textarea
                  rows="2"
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '13px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    outline: 'none',
                    lineHeight: 1.5
                  }}
                  placeholder="Enter full address, street, landmark, city and pincode..."
                />
              </div>

              {/* Payment Methods (Image 1 & 3: Payment Processing) */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', marginBottom: '8px' }}>
                  Select Payment Method
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {[
                    { id: 'UPI', name: 'Instant UPI / QR', desc: 'GPay, PhonePe, Paytm', icon: '⚡' },
                    { id: 'Credit Card', name: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay', icon: '💳' },
                    { id: 'Net Banking', name: 'Net Banking', desc: 'All Major Indian Banks', icon: '🏦' },
                    { id: 'Cash on Delivery', name: 'Cash on Delivery', desc: 'Pay at Doorstep', icon: '💵' }
                  ].map((method) => (
                    <div
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      style={{
                        padding: '12px',
                        borderRadius: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        transition: 'all 0.15s',
                        border: paymentMethod === method.id ? '2px solid #2563eb' : '1px solid #e2e8f0',
                        background: paymentMethod === method.id ? '#eff6ff' : '#ffffff',
                        boxShadow: paymentMethod === method.id ? '0 4px 12px rgba(37,99,235,0.1)' : 'none'
                      }}
                    >
                      <span style={{ fontSize: '22px' }}>{method.icon}</span>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '800', color: '#0f172a' }}>{method.name}</div>
                        <div style={{ fontSize: '10px', color: '#64748b' }}>{method.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary breakdown */}
              <div style={{ padding: '14px 16px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Items Total ({items.length} unique items):</span>
                  <span style={{ fontWeight: '700', color: '#0f172a' }}>{formatPrice(totalAmount)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Shipping & Handling:</span>
                  <span style={{ color: '#10b981', fontWeight: '700' }}>{shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '900', color: '#0f172a', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
                  <span>Final Payable:</span>
                  <span style={{ color: '#2563eb' }}>{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={isProcessing}
                className="btn btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: '14px', fontWeight: '900', borderRadius: '14px', cursor: 'pointer' }}
              >
                {isProcessing ? 'Processing Secure Transaction...' : `Pay & Complete Order (${formatPrice(grandTotal)})`}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
