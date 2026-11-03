import { api } from './api';
import { PlanoIntervencao, Treino } from '../types';
export interface NovoTreino {
  nome: string;
  objetivo: string;
  atividade: string;
  medicao: 'FREQUENCIA' | 'DURACAO';
  categoriaId: number | null;
}
export const planoService = {
  getPlanosByAssistido: async (assistidoId: number): Promise<PlanoIntervencao[]> =>
    (await api.get('/assistidos/' + assistidoId + '/planos')).data,
  getPlano: async (id: number): Promise<PlanoIntervencao> => (await api.get('/planos/' + id)).data,
  getTreinosByPlano: async (planoId: number): Promise<Treino[]> =>
    (await api.get('/planos/' + planoId + '/treinos')).data,
  criarTreino: async (planoId: number, treino: NovoTreino): Promise<Treino> =>
    (await api.post('/planos/' + planoId + '/treinos', treino)).data,
};
