import { api } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Profissional } from '../types';

export const authService = {
  login: async (email: string, senha: string) => {
    const response = await api.post('/auth/login', { email, senha });
    const { token } = response.data;
    await AsyncStorage.setItem('@ClinicABA:token', token);
    return token;
  },
  logout: async () => {
    await AsyncStorage.removeItem('@ClinicABA:token');
  },
  getMe: async (): Promise<Profissional> => {
    const response = await api.get('/profissionais/me');
    return response.data;
  }
};
