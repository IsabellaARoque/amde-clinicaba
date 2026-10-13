import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { treinoService } from '../services/treinoService';
import { categoriaService } from '../services/categoriaService';
import { Treino, Categoria } from '../types';

const TreinoFormPage: React.FC = () => {
  const { planoId, id } = useParams();
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [formData, setFormData] = useState<Partial<Treino>>({
    nome: '', objetivo: '', atividade: '', medicao: 'FREQUENCIA'
  });
  const [categoriaId, setCategoriaId] = useState<number | ''>('');

  useEffect(() => {
    categoriaService.getAll().then(setCategorias);
    if (id) {
      treinoService.getById(Number(id)).then(data => {
        setFormData(data);
        if (data.categoriaTreino) {
          setCategoriaId(data.categoriaTreino.id);
        }
      });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        nome: formData.nome,
        objetivo: formData.objetivo,
        atividade: formData.atividade,
        medicao: formData.medicao,
        categoriaId: categoriaId ? Number(categoriaId) : null
      };
      if (id) {
        await treinoService.update(Number(id), payload);
        navigate(-1);
      } else {
        await treinoService.create(Number(planoId), payload);
        navigate(`/planos/${planoId}`);
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar treino.');
    }
  };

  return (
    <div className="page-container">
      <h1>{id ? 'Editar Treino' : 'Novo Treino'}</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label>Nome do Treino</label>
          <input type="text" value={formData.nome || ''} onChange={e => setFormData({...formData, nome: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Objetivo</label>
          <textarea value={formData.objetivo || ''} onChange={e => setFormData({...formData, objetivo: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Atividade</label>
          <textarea value={formData.atividade || ''} onChange={e => setFormData({...formData, atividade: e.target.value})} required />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Categoria</label>
            <select value={categoriaId} onChange={e => setCategoriaId(Number(e.target.value))} required>
              <option value="">Selecione...</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nome}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Tipo de Medição</label>
            <select value={formData.medicao || 'FREQUENCIA'} onChange={e => setFormData({...formData, medicao: e.target.value as 'FREQUENCIA'|'DURACAO'})} required>
              <option value="FREQUENCIA">Frequência</option>
              <option value="DURACAO">Duração</option>
            </select>
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

export default TreinoFormPage;
