import { api } from './api';
import { Categoria } from '../types';
import { requireArray } from './validateResponse';

export const categoriaService = {
  getCategorias: async (): Promise<Categoria[]> => {
    const response = await api.get('/categorias');
    return requireArray<Categoria>(response.data, 'as categorias');
  }
};
