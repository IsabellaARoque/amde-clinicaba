import api from './api';
import { Assistido, ScorePorCategoria } from '../types';

export const assistidoService = {
  getAll: async (): Promise<Assistido[]> => {
    const response = await api.get('/assistidos');
    return response.data;
  },
  getById: async (id: number): Promise<Assistido> => {
    const response = await api.get(`/assistidos/${id}`);
    return response.data;
  },
  create: async (data: Omit<Assistido, 'id'>): Promise<Assistido> => {
    const response = await api.post('/assistidos', data);
    return response.data;
  },
  update: async (id: number, data: Partial<Assistido>): Promise<Assistido> => {
    const response = await api.put(`/assistidos/${id}`, data);
    return response.data;
  },
  getScores: async (id: number): Promise<ScorePorCategoria[]> => {
    const response = await api.get(`/assistidos/${id}/scores`);
    return response.data;
  }
};
