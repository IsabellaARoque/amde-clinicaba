import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { planoService } from '../services/planoService';
import { treinoService } from '../services/treinoService';
import { PlanoIntervencao, Treino } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiEdit, FiPlus, FiPower } from 'react-icons/fi';

const PlanoDetailPage: React.FC = () => {
  const { id } = useParams();
  const planoId = Number(id);
  const [plano, setPlano] = useState<PlanoIntervencao | null>(null);
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [planoData, treinosData] = await Promise.all([
          planoService.getById(planoId),
          treinoService.getByPlanoId(planoId)
        ]);
        setPlano(planoData);
        setTreinos(treinosData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [planoId]);

  const handleToggleStatus = async () => {
    if (!plano) return;
    try {
      if (plano.status === 'ATIVO') {
        await planoService.desativar(planoId);
      } else {
        await planoService.reativar(planoId);
      }
      setPlano({ ...plano, status: plano.status === 'ATIVO' ? 'INATIVO' : 'ATIVO' });
    } catch (error) {
      alert('Erro ao alterar status.');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!plano) return <div>Plano não encontrado.</div>;

  return (
    <div className="page-container detail-page">
      <div className="page-header">
        <div>
          <h1>{plano.nome}</h1>
          <span className={`status-badge ${plano.status.toLowerCase()}`}>{plano.status}</span>
        </div>
        <div className="header-actions">
          <Link to={`/planos/${planoId}/editar`} className="btn-secondary"><FiEdit /> Editar</Link>
          <button onClick={handleToggleStatus} className="btn-secondary">
            <FiPower /> {plano.status === 'ATIVO' ? 'Desativar' : 'Reativar'}
          </button>
        </div>
      </div>

      <div className="info-card mb-4">
        <h3>Detalhes</h3>
        <p><strong>Objetivo:</strong> {plano.objetivo}</p>
        <p><strong>Criado em:</strong> {new Date(plano.dataCriacao).toLocaleDateString()}</p>
        <p><strong>Profissional Responsável:</strong> {plano.profissionalCriador.nome}</p>
      </div>

      <section className="section">
        <div className="section-header">
          <h2>Treinos ({treinos.length})</h2>
          <Link to={`/planos/${planoId}/treinos/novo`} className="btn-primary btn-sm"><FiPlus /> Adicionar Treino</Link>
        </div>
        
        <div className="list-container">
          {treinos.map(treino => (
            <div key={treino.id} className="list-item">
              <div className="item-info">
                <h3>{treino.nome}</h3>
                <p>Categoria: {treino.categoriaTreino.nome} | Tipo: {treino.medicao}</p>
                <p>Atividade: {treino.atividade}</p>
              </div>
              <div className="item-actions">
                <Link to={`/treinos/${treino.id}/editar`} className="btn-secondary">Editar</Link>
              </div>
            </div>
          ))}
          {treinos.length === 0 && <p className="no-data">Nenhum treino cadastrado.</p>}
        </div>
      </section>
    </div>
  );
};

export default PlanoDetailPage;
