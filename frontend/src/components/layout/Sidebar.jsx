import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import logoSidebar from '../../assets/logo.png';

function Sidebar() {
  // --- ESTADO E CONTEXTO (JavaScript) ---
  // `isDarkMode` é obtido do contexto de tema para ajustar estilos conforme o modo claro/escuro.
  // `useNavigate` e `useLocation` são hooks do `react-router-dom` para gerenciar a navegação e a rota atual.
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // --- LÓGICA DE NAVEGAÇÃO E AUTENTICAÇÃO (JavaScript) ---
  // `handleLogout` remove os dados do usuário do `localStorage` e redireciona para a página de login.
  // `isActive` é uma função auxiliar que verifica se o link de navegação corresponde à rota atual para aplicar estilos de "ativo".
  const handleLogout = () => {
    localStorage.removeItem('familyhub_user_active');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  // --- ESTILOS DINÂMICOS (JavaScript e CSS/Bootstrap) ---
  // `sidebarStyle` e `linkStyle` são objetos de estilo que definem a aparência da barra lateral e dos links.
  // Eles utilizam estilos inline e classes do Bootstrap (implicitamente através da estrutura JSX).
  // As cores e outros atributos são ajustados dinamicamente com base no `isDarkMode` para suportar o tema.
  const sidebarStyle = {
    width: '240px', 
    backgroundColor: isDarkMode ? '#2d2d2d' : '#acdbef', 
    borderRight: `1px solid ${isDarkMode ? '#404040' : '#ffffff'}`, 
    display: 'flex', 
    flexDirection: 'column', 
    padding: '16px 12px', 
    height: '100vh',
    position: 'sticky',
    top: 0,
    transition: 'all 0.3s ease'
  };

  const linkStyle = (path) => ({
    color: isActive(path) ? (isDarkMode ? '#ffffff' : '#1d7785') : (isDarkMode ? '#aaa' : '#14819c'), 
    backgroundColor: isActive(path) ? (isDarkMode ? '#404040' : '#e4fffe') : 'transparent', 
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

  // --- ESTRUTURA DA INTERFACE (JSX, HTML) ---
  // O `return` do componente define a estrutura visual da barra lateral usando JSX.
  // Inclui a logo (`logoSidebar`), o título "FamilyHub" e uma lista de links de navegação para diferentes seções da aplicação.
  // Os ícones são fornecidos pelo Bootstrap Icons (`<i className="bi bi-..."></i>`).
  // Um botão de "Sair" é incluído na parte inferior para a funcionalidade de logout.
  return (
    <aside style={sidebarStyle}>
      <div className="">
        <img src={logoSidebar} alt="Logo" style={{ width: '170px', height: '90px', objectFit: 'cover' }} />
       
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

      <div className="mt-auto pt-3 border-top" style={{ borderColor: isDarkMode ? '#404040' : '#ffffff' }}>
        <button onClick={handleLogout} className="btn btn-sm text-start w-100 d-flex align-items-center gap-2" style={{ color: isDarkMode ? '#aaa' : '#315884', border: 'none', padding: '8px 12px', fontSize: '14px', background: 'none' }}>
          <i className="bi bi-box-arrow-right"></i> Sair
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
