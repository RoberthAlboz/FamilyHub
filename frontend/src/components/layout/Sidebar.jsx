import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import logoSidebar from '../../assets/logo.png';

function Sidebar() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('familyhub_user_active');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const sidebarStyle = {
    width: '240px', 
    backgroundColor: isDarkMode ? '#2d2d2d' : '#f7f7f5', 
    borderRight: `1px solid ${isDarkMode ? '#404040' : '#edece9'}`, 
    display: 'flex', 
    flexDirection: 'column', 
    padding: '16px 12px', 
    height: '100vh',
    position: 'sticky',
    top: 0,
    transition: 'all 0.3s ease'
  };

  const linkStyle = (path) => ({
    color: isActive(path) ? (isDarkMode ? '#ffffff' : '#37352f') : (isDarkMode ? '#aaa' : '#73726e'), 
    backgroundColor: isActive(path) ? (isDarkMode ? '#404040' : '#e9e9e8') : 'transparent', 
    border: 'none', 
    padding: '8px 12px', 
    borderRadius: '4px', 
    fontWeight: isActive(path) ? '600' : '400',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    transition: 'all 0.2s'
  });

  return (
    <aside style={sidebarStyle}>
      <div className="mb-4 px-2 d-flex align-items-center gap-2" style={{ fontWeight: '700', color: isDarkMode ? '#ffffff' : '#37352f', fontSize: '18px' }}>
        <img src={logoSidebar} alt="Logo" style={{ width: '110px', height: '110px', objectFit: 'contain' }} />
        
      </div>

      <nav className="d-flex flex-column gap-1 flex-grow-1">
        <Link to="/dashboard" style={linkStyle('/dashboard')}>
          <i className="bi bi-house-door"></i> Dashboard
        </Link>
        
        <Link to="/tarefas" style={linkStyle('/tarefas')}>
          <i className="bi bi-check2-square"></i> Tarefas
        </Link>
        
        <Link to="/calendario" style={linkStyle('/calendario')}>
          <i className="bi bi-calendar3"></i> Calendário
        </Link>
        
        <Link to="/financas" style={linkStyle('/financas')}>
          <i className="bi bi-cash-stack"></i> Finanças
        </Link>

        <Link to="/relatorios" style={linkStyle('/relatorios')}>
          <i className="bi bi-bar-chart-line"></i> Relatórios
        </Link>

        <Link to="/conquistas" style={linkStyle('/conquistas')}>
          <i className="bi bi-trophy"></i> Conquistas
        </Link>

        <Link to="/membros" style={linkStyle('/membros')}>
          <i className="bi bi-people"></i> Membros
        </Link>
      </nav>

      <div className="mt-auto pt-3 border-top" style={{ borderColor: isDarkMode ? '#404040' : '#edece9' }}>
        <button onClick={handleLogout} className="btn btn-sm text-start w-100 d-flex align-items-center gap-2" style={{ color: isDarkMode ? '#aaa' : '#73726e', border: 'none', padding: '8px 12px', fontSize: '14px', background: 'none' }}>
          <i className="bi bi-box-arrow-right"></i> Sair
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
