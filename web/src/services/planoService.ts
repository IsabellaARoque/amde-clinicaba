import api from './api';
import { PlanoIntervencao } from '../types';

export const planoService = {
  getByAssistidoId: async (assistidoId: number): Promise<PlanoIntervencao[]> => {
    const response = await api.get(`/assistidos/${assistidoId}/planos`);
    return response.data;
  },
  getById: async (id: number): Promise<PlanoIntervencao> => {
    const response = await api.get(`/planos/${id}`);
    return response.data;
  },
  create: async (assistidoId: number, data: Partial<PlanoIntervencao>): Promise<PlanoIntervencao> => {
    const response = await api.post(`/assistidos/${assistidoId}/planos`, data);
    return response.data;
  },
  update: async (id: number, data: Partial<PlanoIntervencao>): Promise<PlanoIntervencao> => {
    const response = await api.put(`/planos/${id}`, data);
    return response.data;
  },
  desativar: async (id: number): Promise<void> => {
    await api.put(`/planos/${id}/desativar`);
  },
  reativar: async (id: number): Promise<void> => {
    await api.put(`/planos/${id}/reativar`);
  }
};
