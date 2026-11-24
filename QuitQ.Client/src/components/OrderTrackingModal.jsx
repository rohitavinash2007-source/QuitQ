import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export function OrderTrackingModal({ orderNumber, onClose }) {
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderNumber) return;
    setLoading(true);
    api.trackOrder(orderNumber)
      .then(res => setTrackingData(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [orderNumber]);

  if (!orderNumber) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content"
        style={{ maxWidth: '580px', padding: '2rem', borderRadius: '24px', position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span className="badge badge-primary text-[10px]">Live Milestone Tracking</span>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>AWB: {trackingData?.trackingNumber || 'QQTRK-10928'}</span>
        </div>
        <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#0f172a', margin: '4px 0' }}>Shipment Progress & Delivery Milestones</h3>
        <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '20px' }}>Tracking Order: <strong style={{ color: '#0f172a' }}>{orderNumber}</strong></p>

        {loading ? (
          <div style={{ padding: '3rem 0', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
            Loading shipment checkpoints...
          </div>
        ) : (
          <div>
            {/* Visual 4-Step Stepper (Image 2: track order) */}
            <div className="stepper-container">
              <div className="stepper-progress-bar">
                <div 
                  className="stepper-progress-fill"
                  style={{
                    width: trackingData?.currentStatus === 'Delivered' ? '100%' :
                           trackingData?.currentStatus === 'Shipped' ? '66%' :
                           trackingData?.currentStatus === 'Processing' ? '33%' : '0%'
                  }}
                ></div>
              </div>

              {trackingData?.steps?.map((step, idx) => (
                <div 
                  key={idx} 
                  className={`step-node ${step.isCompleted ? 'completed' : ''} ${step.isCurrent ? 'current' : ''}`}
                >
                  <div className="step-circle">
                    {step.isCompleted ? (
                      <span style={{ fontSize: '16px', color: '#ffffff' }}>✓</span>
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <div className="step-label">{step.status}</div>
                </div>
              ))}
            </div>

            {/* Checkpoints Detail Feed */}
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569' }}>Milestone History</h4>
              {trackingData?.steps?.map((step, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '12px' }}>
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    marginTop: '5px',
                    flexShrink: 0,
                    background: step.isCompleted ? '#2563eb' : '#cbd5e1'
                  }}></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ color: step.isCompleted ? '#0f172a' : '#94a3b8' }}>{step.status}</strong>
                      {step.timestamp && (
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                          {new Date(step.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Estimated Delivery Notice */}
            <div style={{ marginTop: '20px', padding: '12px 16px', borderRadius: '14px', background: '#eff6ff', border: '1px solid #dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '10px', color: '#2563eb', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.05em' }}>Estimated Package Arrival</div>
                <div style={{ fontSize: '13px', fontWeight: '900', color: '#1e3a8a' }}>
                  {trackingData?.estimatedDeliveryDate 
                    ? new Date(trackingData.estimatedDeliveryDate).toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })
                    : 'Within 3-4 Business Days'}
                </div>
              </div>
              <span className="badge badge-success text-[10px]">On Track</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
