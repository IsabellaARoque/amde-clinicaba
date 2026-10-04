import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/pages/Login.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, senha);
      navigate('/');
    } catch (err) {
      setError('Credenciais inválidas.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login - ClinicABA</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Senha</label>
            <input type="password" value={senha} onChange={e => setSenha(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary btn-block">Entrar</button>
        </form>
        <p className="auth-link">Não tem conta? <Link to="/register">Cadastre-se</Link></p>
      </div>
    </div>
  );
};

export default LoginPage;
