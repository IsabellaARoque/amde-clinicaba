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
        <h2>ClinicABA</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
          <FiHome /> Dashboard
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
