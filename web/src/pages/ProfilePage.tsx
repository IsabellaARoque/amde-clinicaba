import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { Profissional } from '../types';
import { useAuth } from '../hooks/useAuth';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<Partial<Profissional>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome,
        email: user.email,
        cpf: user.cpf
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.updateMe(formData);
      setMessage('Perfil atualizado com sucesso!');
    } catch (error) {
      setMessage('Erro ao atualizar perfil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1>Meu Perfil</h1>
      <div className="form-container">
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>CPF (Apenas visualização)</label>
            <input type="text" value={formData.cpf || ''} disabled />
          </div>
          <div className="form-group">
            <label>Nome Completo</label>
            <input type="text" value={formData.nome || ''} onChange={e => setFormData({...formData, nome: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>Salvar Alterações</button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
