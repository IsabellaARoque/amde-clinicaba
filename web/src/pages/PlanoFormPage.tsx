import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { planoService } from '../services/planoService';
import { PlanoIntervencao } from '../types';

const PlanoFormPage: React.FC = () => {
  const { assistidoId, id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<PlanoIntervencao>>({ nome: '', objetivo: '' });

  useEffect(() => {
    if (id) {
      planoService.getById(Number(id)).then(data => setFormData({ nome: data.nome, objetivo: data.objetivo }));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await planoService.update(Number(id), formData);
        navigate(`/planos/${id}`);
      } else {
        await planoService.create(Number(assistidoId), formData);
        navigate(`/assistidos/${assistidoId}`);
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar plano.');
    }
  };

  return (
    <div className="page-container">
      <h1>{id ? 'Editar Plano' : 'Novo Plano de Intervenção'}</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label>Nome do Plano</label>
          <input type="text" value={formData.nome || ''} onChange={e => setFormData({...formData, nome: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Objetivo Geral</label>
          <textarea rows={5} value={formData.objetivo || ''} onChange={e => setFormData({...formData, objetivo: e.target.value})} required />
        </div>
        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>Cancelar</button>
          <button type="submit" className="btn-primary">Salvar</button>
        </div>
      </form>
    </div>
  );
};

export default PlanoFormPage;
