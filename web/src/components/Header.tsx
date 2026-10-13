import React from 'react';
import { useAuth } from '../hooks/useAuth';
import '../styles/components/Header.css';

const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="main-header">
      <div className="header-content">
        <span>Olá, <strong>{user?.nome}</strong></span>
      </div>
    </header>
  );
};

export default Header;
