import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { assistidoService } from '../services/assistidoService';
import { planoService } from '../services/planoService';
import { Assistido, PlanoIntervencao, ScorePorCategoria } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ScoreCard from '../components/ScoreCard';
import PlanoCard from '../components/PlanoCard';
import '../styles/pages/AssistidoDetail.css';
import { FiEdit, FiPlus, FiList } from 'react-icons/fi';

const AssistidoDetailPage: React.FC = () => {
  const { id } = useParams();
  const assistidoId = Number(id);
  const [assistido, setAssistido] = useState<Assistido | null>(null);
  const [planos, setPlanos] = useState<PlanoIntervencao[]>([]);
  const [scores, setScores] = useState<ScorePorCategoria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assistidoData, planosData, scoresData] = await Promise.all([
          assistidoService.getById(assistidoId),
          planoService.getByAssistidoId(assistidoId),
          assistidoService.getScores(assistidoId)
        ]);
        setAssistido(assistidoData);
        setPlanos(planosData);
        setScores(scoresData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [assistidoId]);

  if (loading) return <LoadingSpinner />;
  if (!assistido) return <div>Assistido não encontrado.</div>;

  const planosAtivos = planos.filter(p => p.status === 'ATIVO');
  const planosInativos = planos.filter(p => p.status === 'INATIVO');

  return (
    <div className="page-container detail-page">
      <div className="page-header">
        <h1>{assistido.nome}</h1>
        <div className="header-actions">
          <Link to={`/assistidos/${assistidoId}/editar`} className="btn-secondary"><FiEdit /> Editar</Link>
          <Link to={`/assistidos/${assistidoId}/sessoes`} className="btn-secondary"><FiList /> Histórico</Link>
        </div>
      </div>

      <div className="info-grid">
        <div className="info-card">
          <h3>Informações Pessoais</h3>
          <p><strong>CPF:</strong> {assistido.cpf}</p>
          <p><strong>Nascimento:</strong> {assistido.dataNasc}</p>
          <p><strong>Responsável:</strong> {assistido.nomeResponsavel}</p>
        </div>
        <div className="info-card">
          <h3>Dados Clínicos</h3>
          <p><strong>Convênio:</strong> {assistido.convenio}</p>
          <p><strong>Sala:</strong> {assistido.sala}</p>
          <p><strong>Agente:</strong> {assistido.agenteDaSala}</p>
        </div>
      </div>

      <section className="section">
        <h2>Scores por Categoria</h2>
        <div className="scores-grid">
          {scores.length > 0 ? scores.map(score => (
            <ScoreCard key={score.categoriaId} score={score} />
          )) : <p>Nenhum score registrado.</p>}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Planos Ativos</h2>
          <Link to={`/assistidos/${assistidoId}/planos/novo`} className="btn-primary btn-sm"><FiPlus /> Novo Plano</Link>
        </div>
        <div className="planos-grid">
          {planosAtivos.map(plano => <PlanoCard key={plano.id} plano={plano} />)}
          {planosAtivos.length === 0 && <p>Nenhum plano ativo.</p>}
        </div>
      </section>

      {planosInativos.length > 0 && (
        <section className="section">
          <h2>Planos Inativos</h2>
          <div className="planos-grid">
            {planosInativos.map(plano => <PlanoCard key={plano.id} plano={plano} />)}
          </div>
        </section>
      )}
    </div>
  );
};

export default AssistidoDetailPage;
