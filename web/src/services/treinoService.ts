import api from './api';
import { Treino } from '../types';

export const treinoService = {
  getByPlanoId: async (planoId: number): Promise<Treino[]> => {
    const response = await api.get(`/planos/${planoId}/treinos`);
    return response.data;
  },
  getById: async (id: number): Promise<Treino> => {
    const response = await api.get(`/treinos/${id}`);
    return response.data;
  },
  create: async (planoId: number, data: any): Promise<Treino> => {
    const response = await api.post(`/planos/${planoId}/treinos`, data);
    return response.data;
  },
  update: async (id: number, data: any): Promise<Treino> => {
    const response = await api.put(`/treinos/${id}`, data);
    return response.data;
  }
};
