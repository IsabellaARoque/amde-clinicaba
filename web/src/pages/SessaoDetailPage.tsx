import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sessaoService } from '../services/sessaoService';
import { Sessao } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiDownload, FiEdit } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

const SessaoDetailPage: React.FC = () => {
  const { id } = useParams();
  const sessaoId = Number(id);
  const { user } = useAuth();
  const [sessao, setSessao] = useState<Sessao | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sessaoService.getById(sessaoId)
      .then(setSessao)
      .finally(() => setLoading(false));
  }, [sessaoId]);

  const handleExportPDF = async () => {
    try {
      const blob = await sessaoService.exportPdf(sessaoId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sessao-${sessaoId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Erro ao exportar PDF.');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!sessao) return <div>Sessão não encontrada.</div>;

  // Check if session is within 24 hours and owned by user
  const sessionDate = new Date(`${sessao.data}T${sessao.horaInicio}`);
  const now = new Date();
  const isWithin24h = (now.getTime() - sessionDate.getTime()) <= 24 * 60 * 60 * 1000;
  const isOwner = user?.id === sessao.profissional.id;
  const canEdit = isWithin24h && isOwner;

  return (
    <div className="page-container detail-page">
      <div className="page-header">
        <h1>Sessão - {sessao.data}</h1>
        <div className="header-actions">
          {canEdit && <Link to={`/sessoes/${sessaoId}/editar`} className="btn-secondary"><FiEdit /> Editar</Link>}
          <button onClick={handleExportPDF} className="btn-primary"><FiDownload /> Exportar PDF</button>
        </div>
      </div>

      <div className="info-grid">
        <div className="info-card">
          <h3>Informações Gerais</h3>
          <p><strong>Assistido:</strong> <Link to={`/assistidos/${sessao.assistidoId}`}>{sessao.assistidoNome}</Link></p>
          <p><strong>Plano:</strong> <Link to={`/planos/${sessao.planoIntervencaoId}`}>{sessao.planoNome}</Link></p>
          <p><strong>Profissional:</strong> {sessao.profissional.nome}</p>
        </div>
        <div className="info-card">
          <h3>Detalhes de Tempo</h3>
          <p><strong>Data:</strong> {new Date(sessao.data).toLocaleDateString()}</p>
          <p><strong>Início:</strong> {sessao.horaInicio}</p>
          <p><strong>Fim:</strong> {sessao.horaFim}</p>
          <p><strong>Score Total:</strong> {sessao.score.toFixed(2)}</p>
        </div>
      </div>

      <div className="info-card mb-4">
        <h3>Observações Gerais</h3>
        <p>{sessao.observacoes || 'Sem observações.'}</p>
      </div>

      <section className="section">
        <h2>Treinos Realizados</h2>
        <div className="list-container">
          {sessao.treinosSessao.map(ts => (
            <div key={ts.id} className="list-item">
              <div className="item-info">
                <h3>{ts.treino.nome}</h3>
                <p>Score: {ts.score.toFixed(2)}</p>
                {ts.treino.medicao === 'FREQUENCIA' && ts.registroFrequencia && (
                  <p>Sem ajuda: {ts.registroFrequencia.execSemAjuda} | Com ajuda: {ts.registroFrequencia.execComAjuda} | Não exec: {ts.registroFrequencia.naoExecutado}</p>
                )}
                {ts.treino.medicao === 'DURACAO' && ts.registroDuracao && (
                  <p>Duração: {ts.registroDuracao.duracao} segundos</p>
                )}
                <p>Obs: {ts.observacoes}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SessaoDetailPage;
