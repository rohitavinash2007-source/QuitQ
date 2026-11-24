import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('quitq_user');
    return saved ? JSON.parse(saved) : {
      userId: 4,
      username: "john_doe",
      email: "john.doe@example.com",
      fullName: "John Doe",
      role: "Customer",
      contactNumber: "+91 9123456789",
      address: "Flat 304, Green Heights, Indiranagar, Bangalore"
    };
  });

  const [token, setToken] = useState(() => localStorage.getItem('quitq_token') || '');

  // Auto-authenticate on first load to get genuine JWT token from .NET Backend
  useEffect(() => {
    if (!token || token.startsWith('demo-') || token.startsWith('mock-')) {
      api.login({ usernameOrEmail: "john.doe@example.com", password: "Customer@123" })
        .then(res => {
          if (res?.token) {
            setUser(res);
            setToken(res.token);
            console.log("[QuitQ] Connected & authenticated with ASP.NET Core Backend. Token acquired.");
          }
        })
        .catch(err => console.warn("[QuitQ] Backend initializing...", err));
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('quitq_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('quitq_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('quitq_token', token);
    } else {
      localStorage.removeItem('quitq_token');
    }
  }, [token]);

  const login = async (usernameOrEmail, password) => {
    try {
      const res = await api.login({ usernameOrEmail, password });
      setUser(res);
      setToken(res.token);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const register = async (data) => {
    try {
      const res = await api.register(data);
      setUser(res);
      setToken(res.token);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('quitq_token');
    localStorage.removeItem('quitq_user');
  };

  // Instant Persona Switcher with real JWT token generation from ASP.NET Core
  const switchDemoRole = async (role) => {
    let email = "john.doe@example.com";
    let password = "Customer@123";

    if (role === 'Admin') {
      email = "admin@quitq.com";
      password = "Admin@123";
    } else if (role === 'Seller') {
      email = "seller.tech@quitq.com";
      password = "Seller@123";
    }

    try {
      const res = await api.login({ usernameOrEmail: email, password });
      if (res?.token) {
        setUser(res);
        setToken(res.token);
        console.log(`[QuitQ] Switched persona to ${role}. Genuine Backend JWT loaded.`);
      }
    } catch (err) {
      console.warn("[QuitQ] Switch fallback:", err);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!user,
      isCustomer: user?.role === 'Customer',
      isSeller: user?.role === 'Seller',
      isAdmin: user?.role === 'Admin',
      login,
      register,
      logout,
      switchDemoRole
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
