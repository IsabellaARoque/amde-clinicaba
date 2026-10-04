import { api } from './api';
import { PlanoIntervencao, Treino } from '../types';

export const planoService = {
  getPlanosByAssistido: async (assistidoId: number): Promise<PlanoIntervencao[]> => {
    const response = await api.get(`/assistidos/${assistidoId}/planos`);
    return response.data;
  },
  getPlano: async (id: number): Promise<PlanoIntervencao> => {
    const response = await api.get(`/planos/${id}`);
    return response.data;
  },
  getTreinosByPlano: async (planoId: number): Promise<Treino[]> => {
    const response = await api.get(`/planos/${planoId}/treinos`);
    return response.data;
  }
};
