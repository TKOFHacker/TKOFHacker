import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (phone: string, password?: string) => Promise<boolean>;
  loginAs: (role: UserRole) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('livelihood_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCurrentUser = async () => {
    try {
      const res = await api.auth.getMe();
      if (res.success && res.data) {
        setUser(res.data);
      } else {
        // Fallback demo user if token is present but expired
        setUser({
          id: 1,
          full_name: 'Demo User',
          phone: '9876543210',
          phone_masked: '98765XXXX0',
          role: 'beneficiary',
          preferred_language: 'ta',
          beneficiary_id: 1,
          district: 'Thanjavur',
          state: 'Tamil Nadu',
          is_profile_completed: true
        });
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Auto-login demo beneficiary if no token exists
    if (!token) {
      loginAs('beneficiary');
    } else {
      fetchCurrentUser();
    }
  }, []);

  const login = async (phone: string, password: string = 'password123'): Promise<boolean> => {
    setIsLoading(true);
    const res = await api.auth.login(phone, password);
    if (res.success && res.data) {
      const accessToken = res.data.access_token;
      localStorage.setItem('livelihood_token', accessToken);
      setToken(accessToken);
      setUser(res.data.user);
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  };

  const loginAs = async (role: UserRole) => {
    const rolePhones: Record<UserRole, string> = {
      beneficiary: '9876543210',
      admin: '9876543211',
      employer: '9876543212',
    };
    await login(rolePhones[role], 'password123');
  };

  const logout = () => {
    localStorage.removeItem('livelihood_token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, loginAs, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
