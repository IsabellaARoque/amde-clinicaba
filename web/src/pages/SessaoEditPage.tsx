import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { sessaoService } from '../services/sessaoService';
import { Sessao, TreinoSessao } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const SessaoEditPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sessao, setSessao] = useState<Sessao | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sessaoService.getById(Number(id)).then(data => {
      setSessao(data);
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessao) return;
    try {
      await sessaoService.update(Number(id), sessao);
      navigate(`/sessoes/${id}`);
    } catch (error) {
      alert('Erro ao salvar sessão.');
    }
  };

  const updateTreino = (tsId: number, field: string, value: any, isFreq = false, isDur = false) => {
    if (!sessao) return;
    const newTreinos = sessao.treinosSessao.map(ts => {
      if (ts.id === tsId) {
        if (isFreq) {
          return { ...ts, registroFrequencia: { ...ts.registroFrequencia, [field]: value } };
        } else if (isDur) {
          return { ...ts, registroDuracao: { ...ts.registroDuracao, [field]: value } };
        }
        return { ...ts, [field]: value };
      }
      return ts;
    });
    setSessao({ ...sessao, treinosSessao: newTreinos as TreinoSessao[] });
  };

  if (loading) return <LoadingSpinner />;
  if (!sessao) return <div>Sessão não encontrada.</div>;

  return (
    <div className="page-container">
      <h1>Editar Sessão</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label>Observações Gerais</label>
          <textarea rows={4} value={sessao.observacoes} onChange={e => setSessao({...sessao, observacoes: e.target.value})} />
        </div>

        <h3>Treinos</h3>
        {sessao.treinosSessao.map(ts => (
          <div key={ts.id} className="treino-edit-card mb-4" style={{border: '1px solid #ddd', padding: '15px', borderRadius: '8px'}}>
            <h4>{ts.treino.nome}</h4>
            
            {ts.treino.medicao === 'FREQUENCIA' && ts.registroFrequencia && (
              <div className="form-row">
                <div className="form-group">
                  <label>Sem Ajuda</label>
                  <input type="number" min="0" value={ts.registroFrequencia.execSemAjuda} onChange={e => updateTreino(ts.id, 'execSemAjuda', Number(e.target.value), true)} />
                </div>
                <div className="form-group">
                  <label>Com Ajuda</label>
                  <input type="number" min="0" value={ts.registroFrequencia.execComAjuda} onChange={e => updateTreino(ts.id, 'execComAjuda', Number(e.target.value), true)} />
                </div>
                <div className="form-group">
                  <label>Não Executado</label>
                  <input type="number" min="0" value={ts.registroFrequencia.naoExecutado} onChange={e => updateTreino(ts.id, 'naoExecutado', Number(e.target.value), true)} />
                </div>
              </div>
            )}
            
            {ts.treino.medicao === 'DURACAO' && ts.registroDuracao && (
              <div className="form-group">
                <label>Duração (segundos)</label>
                <input type="number" min="0" value={ts.registroDuracao.duracao} onChange={e => updateTreino(ts.id, 'duracao', Number(e.target.value), false, true)} />
              </div>
            )}
            
            <div className="form-group">
              <label>Observação do Treino</label>
              <textarea value={ts.observacoes} onChange={e => updateTreino(ts.id, 'observacoes', e.target.value)} />
            </div>
          </div>
        ))}
        
        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>Cancelar</button>
          <button type="submit" className="btn-primary">Salvar Sessão</button>
        </div>
      </form>
    </div>
  );
};

export default SessaoEditPage;
