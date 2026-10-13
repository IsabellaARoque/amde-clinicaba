import { api } from './api';
import { Categoria } from '../types';

export const categoriaService = {
  getCategorias: async (): Promise<Categoria[]> => {
    const response = await api.get('/categorias');
    return response.data;
  }
};
