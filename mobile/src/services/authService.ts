import { api } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Profissional } from '../types';
import { requireObject } from './validateResponse';

export const authService = {
  login: async (email: string, senha: string) => {
    const response = await api.post('/auth/login', { email, senha });
    const data = requireObject<{ token?: unknown }>(response.data, 'a autenticação');
    const { token } = data;
    if (typeof token !== 'string' || token.length === 0) {
      throw new Error('Resposta inválida ao autenticar.');
    }
    await AsyncStorage.setItem('@ClinicABA:token', token);
    return token;
  },
  logout: async () => {
    await AsyncStorage.removeItem('@ClinicABA:token');
  },
  getMe: async (): Promise<Profissional> => {
    const response = await api.get('/profissionais/me');
    return requireObject<Profissional>(response.data, 'o perfil');
  }
};
