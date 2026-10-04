import { api } from './api';
import { Sessao } from '../types';

export const sessaoService = {
  iniciar: async (assistidoId: number, planoIntervencaoId: number): Promise<Sessao> => {
    const response = await api.post(`/assistidos/${assistidoId}/sessoes/iniciar`, { planoIntervencaoId });
    return response.data;
  },
  configurar: async (sessaoId: number, treinoIds: number[]): Promise<void> => {
    await api.put(`/sessoes/${sessaoId}/configurar`, { treinoIds });
  },
  encerrar: async (sessaoId: number, observacoes: string, score: number): Promise<void> => {
    await api.put(`/sessoes/${sessaoId}/encerrar`, { observacoes, score });
  },
  getSessao: async (sessaoId: number): Promise<Sessao> => {
    const response = await api.get(`/sessoes/${sessaoId}`);
    return response.data;
  }
};
