import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import AssistidoFormPage from './pages/AssistidoFormPage';
import AssistidoDetailPage from './pages/AssistidoDetailPage';
import PlanoFormPage from './pages/PlanoFormPage';
import PlanoDetailPage from './pages/PlanoDetailPage';
import TreinoFormPage from './pages/TreinoFormPage';
import SessaoDetailPage from './pages/SessaoDetailPage';
import SessaoEditPage from './pages/SessaoEditPage';
import HistoricoSessoesPage from './pages/HistoricoSessoesPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<DashboardPage />} />
            <Route path="perfil" element={<ProfilePage />} />
            
            <Route path="assistidos/novo" element={<AssistidoFormPage />} />
            <Route path="assistidos/:id" element={<AssistidoDetailPage />} />
            <Route path="assistidos/:id/editar" element={<AssistidoFormPage />} />
            <Route path="assistidos/:assistidoId/planos/novo" element={<PlanoFormPage />} />
            <Route path="assistidos/:assistidoId/sessoes" element={<HistoricoSessoesPage />} />
            
            <Route path="planos/:id" element={<PlanoDetailPage />} />
            <Route path="planos/:id/editar" element={<PlanoFormPage />} />
            <Route path="planos/:planoId/treinos/novo" element={<TreinoFormPage />} />
            
            <Route path="treinos/:id/editar" element={<TreinoFormPage />} />
            
            <Route path="sessoes/:id" element={<SessaoDetailPage />} />
            <Route path="sessoes/:id/editar" element={<SessaoEditPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
