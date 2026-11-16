import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  setAuthModalMode: (mode: 'login' | 'register') => void;
  login: (email: string, pass: string) => Promise<void>;
  register: (payload: { name: string; email: string; password: string; phone?: string; address?: string; role?: 'customer' | 'admin' }) => Promise<void>;
  logout: () => void;
  loginAsDemoCustomer: () => Promise<void>;
  loginAsDemoAdmin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('foodiehub_token'));
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const fetchedUser = await api.getCurrentUser();
          if (fetchedUser) {
            setUser(fetchedUser);
          } else {
            // Token expired or invalid
            localStorage.removeItem('foodiehub_token');
            setToken(null);
            setUser(null);
          }
        } catch {
          localStorage.removeItem('foodiehub_token');
          setToken(null);
          setUser(null);
        }
      } else {
        // Automatically sign in as default demo user Harshith if nothing is set
        // so customer features like "My Orders" work out of the box!
        loginAsDemoCustomer().catch(() => {});
      }
      setIsLoading(false);
    }
    loadUser();
  }, []);

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (email: string, pass: string) => {
    const res = await api.login(email, pass);
    localStorage.setItem('foodiehub_token', res.token);
    setToken(res.token);
    setUser(res.user);
    closeAuthModal();
  };

  const register = async (payload: { name: string; email: string; password: string; phone?: string; address?: string; role?: 'customer' | 'admin' }) => {
    const res = await api.register(payload);
    localStorage.setItem('foodiehub_token', res.token);
    setToken(res.token);
    setUser(res.user);
    closeAuthModal();
  };

  const logout = () => {
    localStorage.removeItem('foodiehub_token');
    setToken(null);
    setUser(null);
  };

  const loginAsDemoCustomer = async () => {
    await login('harshith@gmail.com', 'password123');
  };

  const loginAsDemoAdmin = async () => {
    await login('admin@foodiehub.com', 'admin123');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAdmin,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        setAuthModalMode,
        login,
        register,
        logout,
        loginAsDemoCustomer,
        loginAsDemoAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
