import React from 'react';
import { useAuth } from '../hooks/useAuth';
import '../styles/components/Header.css';

const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="main-header">
      <div className="header-content">
        <div className="header-avatar" aria-hidden="true">
          {user?.nome?.trim().charAt(0).toUpperCase() || 'P'}
        </div>
        <div className="header-copy">
          <span>Olá, <strong>{user?.nome?.trim().split(' ')[0] || 'profissional'}</strong></span>
          <small>Seu cuidado faz a diferença.</small>
        </div>
      </div>
    </header>
  );
};

export default Header;
