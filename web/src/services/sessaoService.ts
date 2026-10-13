import api from './api';
import { Sessao } from '../types';

export const sessaoService = {
  getByAssistidoId: async (assistidoId: number): Promise<Sessao[]> => {
    const response = await api.get(`/assistidos/${assistidoId}/sessoes`);
    return response.data;
  },
  getById: async (id: number): Promise<Sessao> => {
    const response = await api.get(`/sessoes/${id}`);
    return response.data;
  },
  update: async (id: number, data: Partial<Sessao>): Promise<Sessao> => {
    const response = await api.put(`/sessoes/${id}/editar`, data);
    return response.data;
  },
  exportPdf: async (id: number): Promise<Blob> => {
    const response = await api.get(`/sessoes/${id}/exportar-pdf`, { responseType: 'blob' });
    return response.data;
  }
};
