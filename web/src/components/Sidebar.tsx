import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FiHome, FiUser, FiLogOut } from 'react-icons/fi';
import '../styles/components/Sidebar.css';

const Sidebar: React.FC = () => {
  const { signOut } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand" aria-label="ClinicABA">
          <span className="brand-mark" aria-hidden="true">
            <span /><span /><span /><span />
          </span>
          <span className="brand-copy">
            <strong>ClinicABA</strong>
            <small>Cuidado e evolução</small>
          </span>
        </div>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
          <FiHome /> Pacientes
        </NavLink>
        <NavLink to="/perfil" className={({ isActive }) => isActive ? 'active' : ''}>
          <FiUser /> Meu Perfil
        </NavLink>
        <button onClick={signOut} className="logout-btn">
          <FiLogOut /> Sair
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
