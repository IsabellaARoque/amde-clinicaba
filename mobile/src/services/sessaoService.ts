import { api } from './api';
import { Sessao } from '../types';
import { requireArray, requireObject } from './validateResponse';

function requireSessao(value: unknown): Sessao {
  const sessao = requireObject<Sessao>(value, 'a sessão');
  requireArray(sessao.treinosSessao, 'os treinos da sessão');
  return sessao;
}

export const sessaoService = {
  iniciar: async (assistidoId: number, planoIntervencaoId: number): Promise<Sessao> => {
    const response = await api.post(`/assistidos/${assistidoId}/sessoes/iniciar`, { planoIntervencaoId });
    return requireSessao(response.data);
  },
  configurar: async (sessaoId: number, treinoIds: number[]): Promise<void> => {
    await api.put(`/sessoes/${sessaoId}/configurar`, { treinoIds });
  },
  encerrar: async (sessaoId: number, observacoes: string, score: number): Promise<void> => {
    await api.put(`/sessoes/${sessaoId}/encerrar`, { observacoes, score });
  },
  getSessao: async (sessaoId: number): Promise<Sessao> => {
    const response = await api.get(`/sessoes/${sessaoId}`);
    return requireSessao(response.data);
  }
};
