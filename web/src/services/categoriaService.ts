import api from './api';
import { Categoria } from '../types';

export const categoriaService = {
  getAll: async (): Promise<Categoria[]> => {
    const response = await api.get('/categorias');
    return response.data;
  },
  create: async (nome: string): Promise<Categoria> => {
    const response = await api.post('/categorias', { nome });
    return response.data;
  }
};
