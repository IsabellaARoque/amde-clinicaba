import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { assistidoService } from '../services/assistidoService';
import { Assistido } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/pages/Dashboard.css';
import { FiPlus, FiSearch } from 'react-icons/fi';

const DashboardPage: React.FC = () => {
  const [assistidos, setAssistidos] = useState<Assistido[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadAssistidos();
  }, []);

  const loadAssistidos = async () => {
    try {
      const data = await assistidoService.getAll();
      setAssistidos(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssistidos = assistidos.filter(a => a.nome.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Dashboard - Assistidos</h1>
        <Link to="/assistidos/novo" className="btn-primary"><FiPlus /> Novo Assistido</Link>
      </div>

      <div className="search-bar">
        <FiSearch className="search-icon" />
        <input 
          type="text" 
          placeholder="Buscar assistido por nome..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="list-container">
        {filteredAssistidos.map(assistido => (
          <div key={assistido.id} className="list-item">
            <div className="item-info">
              <h3>{assistido.nome}</h3>
              <p>CPF: {assistido.cpf}</p>
            </div>
            <div className="item-actions">
              <Link to={`/assistidos/${assistido.id}`} className="btn-secondary">Acessar Perfil</Link>
            </div>
          </div>
        ))}
        {filteredAssistidos.length === 0 && (
          <p className="no-data">Nenhum assistido encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
