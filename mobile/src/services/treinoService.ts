import { api } from './api';
import { TreinoSessao } from '../types';

export const treinoService = {
  iniciarTreinoSessao: async (sessaoId: number, treinoId: number): Promise<TreinoSessao> => {
    const response = await api.post(`/sessoes/${sessaoId}/treinos/${treinoId}/iniciar`);
    return response.data;
  },
  registroFrequencia: async (treinoSessaoId: number, execSemAjuda: number, execComAjuda: number, naoExecutado: number): Promise<void> => {
    await api.post(`/treino-sessao/${treinoSessaoId}/registro-frequencia`, { execSemAjuda, execComAjuda, naoExecutado });
  },
  registroDuracao: async (treinoSessaoId: number, duracao: number): Promise<void> => {
    await api.post(`/treino-sessao/${treinoSessaoId}/registro-duracao`, { duracao });
  },
  encerrarTreinoSessao: async (treinoSessaoId: number, observacoes: string, score: number): Promise<void> => {
    await api.put(`/treino-sessao/${treinoSessaoId}/encerrar`, { observacoes, score });
  }
};
