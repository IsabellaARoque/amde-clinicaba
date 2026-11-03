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
      <div className="auth-layout">
        <div className="auth-intro">
          <div className="auth-mark" aria-hidden="true"><span /><span /><span /><span /></div>
          <p className="page-eyebrow">CLINICABA</p>
          <h1>Um espaço para acompanhar cada conquista.</h1>
          <p>Crie seu acesso profissional e mantenha a evolução de cada paciente sempre por perto.</p>
        </div>
        <div className="auth-card">
          <h2>Cadastro profissional</h2>
          <p className="auth-card-subtitle">Preencha seus dados para começar.</p>
          {error && <p className="error-message" role="alert">{error}</p>}
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
            <button type="submit" className="btn-primary btn-block">Criar conta →</button>
          </form>
          <p className="auth-link">Já tem conta? <Link to="/login">Faça login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
