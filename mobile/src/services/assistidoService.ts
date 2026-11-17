import { api } from './api';
import { Assistido, ScorePorCategoria, SessaoResumo } from '../types';
import { requireArray, requireObject } from './validateResponse';

export const assistidoService = {
  getAssistidos: async (): Promise<Assistido[]> => {
    const response = await api.get('/assistidos');
    return requireArray<Assistido>(response.data, 'os pacientes');
  },
  getAssistido: async (id: number): Promise<Assistido> => {
    const response = await api.get(`/assistidos/${id}`);
    return requireObject<Assistido>(response.data, 'o paciente');
  },
  getScores: async (assistidoId: number): Promise<ScorePorCategoria[]> => {
    const response = await api.get(`/assistidos/${assistidoId}/scores`);
    return requireArray<ScorePorCategoria>(response.data, 'os scores');
  },
  getSessoes: async (assistidoId: number): Promise<SessaoResumo[]> => {
    const response = await api.get(`/assistidos/${assistidoId}/sessoes`);
    return requireArray<SessaoResumo>(response.data, 'as sessões');
  }
};
