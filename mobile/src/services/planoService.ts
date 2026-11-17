import { api } from './api';
import { PlanoIntervencao, Treino } from '../types';
import { requireArray, requireObject } from './validateResponse';
export interface NovoTreino {
  nome: string;
  objetivo: string;
  atividade: string;
  medicao: 'FREQUENCIA' | 'DURACAO';
  categoriaId: number | null;
}
export const planoService = {
  getPlanosByAssistido: async (assistidoId: number): Promise<PlanoIntervencao[]> =>
    requireArray<PlanoIntervencao>(
      (await api.get('/assistidos/' + assistidoId + '/planos')).data,
      'os planos',
    ),
  getPlano: async (id: number): Promise<PlanoIntervencao> =>
    requireObject<PlanoIntervencao>((await api.get('/planos/' + id)).data, 'o plano'),
  getTreinosByPlano: async (planoId: number): Promise<Treino[]> =>
    requireArray<Treino>((await api.get('/planos/' + planoId + '/treinos')).data, 'os treinos'),
  criarTreino: async (planoId: number, treino: NovoTreino): Promise<Treino> =>
    requireObject<Treino>(
      (await api.post('/planos/' + planoId + '/treinos', treino)).data,
      'o treino criado',
    ),
};
