import { api } from './api';
import { Assistido, ScorePorCategoria, SessaoResumo } from '../types';

export const assistidoService = {
  getAssistidos: async (): Promise<Assistido[]> => {
    const response = await api.get('/assistidos');
    return response.data;
  },
  getAssistido: async (id: number): Promise<Assistido> => {
    const response = await api.get(`/assistidos/${id}`);
    return response.data;
  },
  getScores: async (assistidoId: number): Promise<ScorePorCategoria[]> => {
    const response = await api.get(`/assistidos/${assistidoId}/scores`);
    return response.data;
  },
  getSessoes: async (assistidoId: number): Promise<SessaoResumo[]> => {
    const response = await api.get(`/assistidos/${assistidoId}/sessoes`);
    return response.data;
  }
};
