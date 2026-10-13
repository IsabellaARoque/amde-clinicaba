import api from './api';
import { Profissional } from '../types';

export const authService = {
  login: async (email: string, senha: string): Promise<{ token: string }> => {
    const response = await api.post('/auth/login', { email, senha });
    return response.data;
  },
  register: async (data: Omit<Profissional, 'id'> & { senha: string }): Promise<void> => {
    await api.post('/auth/register', data);
  },
  getMe: async (): Promise<Profissional> => {
    const response = await api.get('/profissionais/me');
    return response.data;
  },
  updateMe: async (data: Partial<Profissional>): Promise<Profissional> => {
    const response = await api.put('/profissionais/me', data);
    return response.data;
  }
};
