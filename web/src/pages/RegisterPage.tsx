import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import '../styles/pages/Login.css';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({ cpf: '', nome: '', email: '', senha: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.register(formData);
      navigate('/login');
    } catch (err) {
      setError('Erro ao realizar cadastro.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Cadastro Profissional</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>CPF</label>
            <input type="text" value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Nome Completo</label>
            <input type="text" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Senha</label>
            <input type="password" value={formData.senha} onChange={e => setFormData({...formData, senha: e.target.value})} required />
          </div>
          <button type="submit" className="btn-primary btn-block">Cadastrar</button>
        </form>
        <p className="auth-link">Já tem conta? <Link to="/login">Faça Login</Link></p>
      </div>
    </div>
  );
};

export default RegisterPage;
