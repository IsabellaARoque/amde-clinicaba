import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sessaoService } from '../services/sessaoService';
import { Sessao } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const HistoricoSessoesPage: React.FC = () => {
  const { assistidoId } = useParams();
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sessaoService.getByAssistidoId(Number(assistidoId))
      .then(setSessoes)
      .finally(() => setLoading(false));
  }, [assistidoId]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Histórico de Sessões</h1>
        <Link to={`/assistidos/${assistidoId}`} className="btn-secondary">Voltar ao Perfil</Link>
      </div>

      <div className="list-container">
        {sessoes.map(sessao => (
          <div key={sessao.id} className="list-item">
            <div className="item-info">
              <h3>Sessão - {new Date(sessao.data).toLocaleDateString()}</h3>
              <p>Plano: {sessao.planoNome} | Profissional: {sessao.profissional.nome}</p>
              <p>Score: {sessao.score.toFixed(2)}</p>
            </div>
            <div className="item-actions">
              <Link to={`/sessoes/${sessao.id}`} className="btn-primary">Ver Detalhes</Link>
            </div>
          </div>
        ))}
        {sessoes.length === 0 && <p className="no-data">Nenhuma sessão registrada.</p>}
      </div>
    </div>
  );
};

export default HistoricoSessoesPage;
