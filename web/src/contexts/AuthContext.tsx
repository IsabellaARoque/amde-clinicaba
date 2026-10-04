import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Profissional } from '../types';
import { authService } from '../services/authService';

export interface AuthContextData {
  signed: boolean;
  user: Profissional | null;
  loading: boolean;
  signIn: (email: string, senha: string) => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profissional | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const storageToken = localStorage.getItem('token');
      
      if (storageToken) {
        try {
          const userData = await authService.getMe();
          setUser(userData);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    }
    loadStorageData();
  }, []);

  async function signIn(email: string, senha: string) {
    const { token } = await authService.login(email, senha);
    localStorage.setItem('token', token);
    const userData = await authService.getMe();
    setUser(userData);
  }

  function signOut() {
    localStorage.removeItem('token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
