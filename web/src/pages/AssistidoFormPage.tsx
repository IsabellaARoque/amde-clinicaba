import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { assistidoService } from '../services/assistidoService';
import { Assistido } from '../types';

const AssistidoFormPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<Assistido>>({
    cpf: '', nome: '', dataNasc: '', convenio: '', sala: '', agenteDaSala: '', periodo: '', frequencia: '', nomeResponsavel: '', cpfResponsavel: ''
  });

  useEffect(() => {
    if (id) {
      assistidoService.getById(Number(id)).then(data => setFormData(data));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await assistidoService.update(Number(id), formData);
      } else {
        await assistidoService.create(formData as Omit<Assistido, 'id'>);
      }
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar.');
    }
  };

  return (
    <div className="page-container">
      <h1>{id ? 'Editar Assistido' : 'Novo Assistido'}</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-row">
          <div className="form-group">
            <label>Nome Completo</label>
            <input type="text" value={formData.nome || ''} onChange={e => setFormData({...formData, nome: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>CPF</label>
            <input type="text" value={formData.cpf || ''} onChange={e => setFormData({...formData, cpf: e.target.value})} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Data de Nascimento</label>
            <input type="date" value={formData.dataNasc || ''} onChange={e => setFormData({...formData, dataNasc: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Convênio</label>
            <input type="text" value={formData.convenio || ''} onChange={e => setFormData({...formData, convenio: e.target.value})} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Nome do Responsável</label>
            <input type="text" value={formData.nomeResponsavel || ''} onChange={e => setFormData({...formData, nomeResponsavel: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>CPF do Responsável</label>
            <input type="text" value={formData.cpfResponsavel || ''} onChange={e => setFormData({...formData, cpfResponsavel: e.target.value})} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Sala</label>
            <input type="text" value={formData.sala || ''} onChange={e => setFormData({...formData, sala: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Agente da Sala</label>
            <input type="text" value={formData.agenteDaSala || ''} onChange={e => setFormData({...formData, agenteDaSala: e.target.value})} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Período</label>
            <input type="text" value={formData.periodo || ''} onChange={e => setFormData({...formData, periodo: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Frequência</label>
            <input type="text" value={formData.frequencia || ''} onChange={e => setFormData({...formData, frequencia: e.target.value})} />
          </div>
        </div>
        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>Cancelar</button>
          <button type="submit" className="btn-primary">Salvar</button>
        </div>
      </form>
    </div>
  );
};

export default AssistidoFormPage;
