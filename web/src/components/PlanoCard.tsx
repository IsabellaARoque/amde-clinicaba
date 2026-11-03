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
      <div className="plano-card-header">
        <h3>{plano.nome}</h3>
        <span className={`status-badge ${plano.status.toLowerCase()}`}>
          {plano.status === 'ATIVO' ? 'Ativo' : 'Inativo'}
        </span>
      </div>
      <p className="plano-card-objective">{plano.objetivo || 'Objetivo não informado.'}</p>
      <Link to={`/planos/${plano.id}`} className="btn-details">Acessar plano →</Link>
    </div>
  );
};

export default PlanoCard;
