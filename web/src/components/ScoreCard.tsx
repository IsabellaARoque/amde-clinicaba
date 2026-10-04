import React from 'react';
import { ScorePorCategoria } from '../types';
import '../styles/components/ScoreCard.css';

interface ScoreCardProps {
  score: ScorePorCategoria;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ score }) => {
  return (
    <div className="score-card">
      <div className="score-title">{score.categoriaNome}</div>
      <div className="score-value">{score.valor.toFixed(2)}</div>
    </div>
  );
};

export default ScoreCard;
