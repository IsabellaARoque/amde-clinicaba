import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import { Profissional } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
interface AuthContextData {
  signed: boolean;
  user: Profissional | null;
  loading: boolean;
  signIn: (email: string, senha: string) => Promise<void>;
  signOut: () => Promise<void>;
}
export const AuthContext = createContext<AuthContextData>({} as AuthContextData);
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Profissional | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let mounted = true;
    async function loadStorageData() {
      try {
        const token = await AsyncStorage.getItem('@ClinicABA:token');
        if (token) {
          const userData = await authService.getMe();
          if (mounted) setUser(userData);
        }
      } catch {
        await AsyncStorage.removeItem('@ClinicABA:token').catch(() => {});
      } finally {
        if (mounted) setLoading(false);
      }
    }
    void loadStorageData();
    return () => {
      mounted = false;
    };
  }, []);
  async function signIn(email: string, senha: string) {
    await authService.login(email, senha);
    const userData = await authService.getMe();
    setUser(userData);
  }
  async function signOut() {
    await authService.logout();
    setUser(null);
  }
  return (
    <AuthContext.Provider value={{ signed: !!user, user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
