import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function AuthModal({ isOpen, onClose }) {
  const { login, register } = useAuth();
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Login form
  const [loginData, setLoginData] = useState({ usernameOrEmail: '', password: '' });

  // Registration form (Image 4: name, gender, contact number, address, role, etc.)
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    gender: 'Male',
    contactNumber: '',
    address: '',
    role: 'Customer',
    storeName: ''
  });

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    const res = await login(loginData.usernameOrEmail, loginData.password);
    setLoading(false);
    if (res.success) {
      onClose();
    } else {
      setErrorMessage(res.message || 'Login failed');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    const res = await register(registerData);
    setLoading(false);
    if (res.success) {
      onClose();
    } else {
      setErrorMessage(res.message || 'Registration failed');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content"
        style={{ maxWidth: '480px', padding: '2rem', borderRadius: '24px', position: 'relative' }}
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

        {/* Tab Headers */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: '24px' }}>
          <button
            onClick={() => { setIsLoginTab(true); setErrorMessage(''); }}
            style={{
              flex: 1,
              paddingBottom: '12px',
              fontSize: '13px',
              fontWeight: '800',
              textAlign: 'center',
              cursor: 'pointer',
              borderBottom: isLoginTab ? '3px solid #2563eb' : '3px solid transparent',
              color: isLoginTab ? '#2563eb' : '#94a3b8'
            }}
          >
            Sign In to Account
          </button>
          <button
            onClick={() => { setIsLoginTab(false); setErrorMessage(''); }}
            style={{
              flex: 1,
              paddingBottom: '12px',
              fontSize: '13px',
              fontWeight: '800',
              textAlign: 'center',
              cursor: 'pointer',
              borderBottom: !isLoginTab ? '3px solid #2563eb' : '3px solid transparent',
              color: !isLoginTab ? '#2563eb' : '#94a3b8'
            }}
          >
            Create New Account
          </button>
        </div>

        {errorMessage && (
          <div style={{ marginBottom: '16px', padding: '10px 14px', borderRadius: '10px', background: '#fff1f2', border: '1px solid #fecdd3', color: '#e11d48', fontSize: '12px' }}>
            {errorMessage}
          </div>
        )}

        {isLoginTab ? (
          /* Login Form (Image 4: log in using credentials) */
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '12px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '11px', marginBottom: '6px' }}>
                Username or Email Address
              </label>
              <input
                type="text"
                required
                value={loginData.usernameOrEmail}
                onChange={(e) => setLoginData({ ...loginData, usernameOrEmail: e.target.value })}
                placeholder="e.g. john.doe@example.com"
                style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '11px', marginBottom: '6px' }}>
                Password
              </label>
              <input
                type="password"
                required
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                placeholder="••••••••"
                style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ padding: '14px', fontSize: '13px', fontWeight: '800', borderRadius: '12px', marginTop: '8px' }}
            >
              {loading ? 'Authenticating...' : 'Sign In to QuitQ'}
            </button>
          </form>
        ) : (
          /* Registration Form (Image 4: providing personal details - name, gender, contact number, address) */
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '800', color: '#475569', marginBottom: '4px' }}>Username</label>
                <input
                  type="text"
                  required
                  value={registerData.username}
                  onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                  placeholder="alex_kumar"
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '800', color: '#475569', marginBottom: '4px' }}>Full Name</label>
                <input
                  type="text"
                  required
                  value={registerData.fullName}
                  onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                  placeholder="Alex Kumar"
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '800', color: '#475569', marginBottom: '4px' }}>Email</label>
                <input
                  type="email"
                  required
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  placeholder="alex@example.com"
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '800', color: '#475569', marginBottom: '4px' }}>Password</label>
                <input
                  type="password"
                  required
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  placeholder="Minimum 6 chars"
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '800', color: '#475569', marginBottom: '4px' }}>Phone Number</label>
                <input
                  type="tel"
                  required
                  value={registerData.contactNumber}
                  onChange={(e) => setRegisterData({ ...registerData, contactNumber: e.target.value })}
                  placeholder="+91 9876543210"
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '800', color: '#475569', marginBottom: '4px' }}>Gender</label>
                <select
                  value={registerData.gender}
                  onChange={(e) => setRegisterData({ ...registerData, gender: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', background: '#ffffff' }}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: '800', color: '#475569', marginBottom: '4px' }}>Address</label>
              <input
                type="text"
                required
                value={registerData.address}
                onChange={(e) => setRegisterData({ ...registerData, address: e.target.value })}
                placeholder="Street address, city, pincode"
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: '800', color: '#475569', marginBottom: '4px' }}>Register Account Type</label>
              <div style={{ display: 'flex', gap: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: '700' }}>
                  <input
                    type="radio"
                    name="role"
                    value="Customer"
                    checked={registerData.role === 'Customer'}
                    onChange={() => setRegisterData({ ...registerData, role: 'Customer' })}
                  />
                  <span>Customer (Buyer)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: '700' }}>
                  <input
                    type="radio"
                    name="role"
                    value="Seller"
                    checked={registerData.role === 'Seller'}
                    onChange={() => setRegisterData({ ...registerData, role: 'Seller' })}
                  />
                  <span>Seller (Merchant)</span>
                </label>
              </div>
            </div>

            {registerData.role === 'Seller' && (
              <div>
                <label style={{ display: 'block', fontWeight: '800', color: '#475569', marginBottom: '4px' }}>Store / Merchant Name</label>
                <input
                  type="text"
                  required
                  value={registerData.storeName}
                  onChange={(e) => setRegisterData({ ...registerData, storeName: e.target.value })}
                  placeholder="e.g. Apex Tech Traders"
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ padding: '12px', fontSize: '13px', fontWeight: '800', borderRadius: '10px', marginTop: '6px' }}
            >
              {loading ? 'Creating Profile...' : 'Complete Registration'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
