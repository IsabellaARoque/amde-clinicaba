import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { assistidoService } from '../services/assistidoService';
import { Assistido } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/pages/Dashboard.css';
import { FiPlus, FiSearch, FiX } from 'react-icons/fi';

const normalizeSearch = (value: string) =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const DashboardPage: React.FC = () => {
  const [assistidos, setAssistidos] = useState<Assistido[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadAssistidos();
  }, []);

  const loadAssistidos = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await assistidoService.getAll();
      setAssistidos(data);
    } catch (error) {
      console.error(error);
      setError('Não foi possível carregar os pacientes. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const filteredAssistidos = assistidos.filter(a => normalizeSearch(a.nome).includes(normalizeSearch(searchTerm)));

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-container">
      <div className="dashboard-hero">
        <div className="dashboard-hero-copy">
          <p className="page-eyebrow">PACIENTES</p>
          <h1>Acompanhe cada evolução.</h1>
          <p>Encontre rapidamente um paciente e acesse planos, sessões e resultados.</p>
          <span className="dashboard-count">{assistidos.length} {assistidos.length === 1 ? 'paciente' : 'pacientes'}</span>
        </div>
        <Link to="/assistidos/novo" className="btn-primary"><FiPlus /> Novo paciente</Link>
      </div>

      <div className="search-bar">
        <FiSearch className="search-icon" />
        <input 
          type="text" 
          placeholder="Buscar assistido por nome..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          aria-label="Pesquisar pacientes pelo nome"
        />
        {searchTerm && <button type="button" className="clear-search" aria-label="Limpar pesquisa" onClick={() => setSearchTerm('')}><FiX /></button>}
      </div>

      {error && <div className="error-message" role="alert">{error} <button type="button" className="btn-secondary btn-sm" onClick={loadAssistidos}>Tentar novamente</button></div>}

      <div className="patient-list">
        {filteredAssistidos.map(assistido => (
          <Link key={assistido.id} to={`/assistidos/${assistido.id}`} className="patient-card">
            <div className="patient-card-content">
              <h3>{assistido.nome}</h3>
              <p>{[assistido.periodo, assistido.sala && `Sala ${assistido.sala}`].filter(Boolean).join(' · ') || 'Ver informações do paciente'}</p>
            </div>
            <span className="patient-arrow" aria-hidden="true">→</span>
          </Link>
        ))}
        {!error && filteredAssistidos.length === 0 && (
          <p className="no-data">{searchTerm ? 'Nenhum paciente encontrado. Tente pesquisar por outro nome.' : 'Nenhum paciente cadastrado.'}</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
