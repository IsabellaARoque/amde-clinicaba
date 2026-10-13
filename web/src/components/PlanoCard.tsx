import React from 'react';
import { PlanoIntervencao } from '../types';
import { Link } from 'react-router-dom';
import '../styles/components/PlanoCard.css';

interface PlanoCardProps {
  plano: PlanoIntervencao;
}

const PlanoCard: React.FC<PlanoCardProps> = ({ plano }) => {
  return (
    <div className={`plano-card ${plano.status.toLowerCase()}`}>
      <h3>{plano.nome}</h3>
      <p><strong>Objetivo:</strong> {plano.objetivo}</p>
      <p><strong>Status:</strong> <span className={`status-badge ${plano.status.toLowerCase()}`}>{plano.status}</span></p>
      <Link to={`/planos/${plano.id}`} className="btn-details">Ver Detalhes</Link>
    </div>
  );
};

export default PlanoCard;
