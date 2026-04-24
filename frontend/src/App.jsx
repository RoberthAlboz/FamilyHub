import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';

// Importações das páginas
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Dashboard from './pages/Dashboard';
import Tarefas from './pages/Tarefas';
import Calendario from './pages/Calendario';
import Financas from './pages/Financas';
import Membros from './pages/Membros';
import Relatorios from './pages/Relatorios';
import Conquistas from './pages/Conquistas';

import Layout from './components/layout/Layout';

// Componente para Proteção de Rotas
const PrivateRoute = ({ children }) => {
  const user = localStorage.getItem('familyhub_user_active');
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />

            {/* Rotas Privadas dentro do Layout */}
            <Route path="/" element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="tarefas" element={<Tarefas />} />
              <Route path="calendario" element={<Calendario />} />
              <Route path="financas" element={<Financas />} />
              <Route path="membros" element={<Membros />} />
              <Route path="relatorios" element={<Relatorios />} />
              <Route path="conquistas" element={<Conquistas />} />
            </Route>

            {/* Redirecionamento padrão */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
