import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';

const API_URL_MEMBROS = 'http://localhost/FamilyHub/api/membros.php';

function Navbar() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { notifications, markAllAsRead } = useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [membros, setMembros] = useState([]);
  const [usuarioAtual, setUsuarioAtual] = useState(null);

  const carregarUsuariosDoBanco = async () => {
    try {
      const response = await fetch(API_URL_MEMBROS);
      if (!response.ok) throw new Error('Erro na resposta da API');
      
      const data = await response.json();
      const lista = Array.isArray(data) ? data : [];
      setMembros(lista);

      const saved = localStorage.getItem('familyhub_user_active');
      const logadoSalvo = saved ? JSON.parse(saved) : null;

      if (lista.length > 0 && logadoSalvo) {
        const usuarioAtualizado = lista.find(m => m.id == logadoSalvo.id);
        if (usuarioAtualizado) {
          setUsuarioAtual(usuarioAtualizado);
          localStorage.setItem('familyhub_user_active', JSON.stringify(usuarioAtualizado));
        } else {
          setUsuarioAtual(logadoSalvo);
        }
      } else if (logadoSalvo) {
        setUsuarioAtual(logadoSalvo);
      }
    } catch (error) {
      console.error("Erro ao carregar membros:", error);
    }
  };

  useEffect(() => {
    carregarUsuariosDoBanco();
    window.addEventListener('atualiza-xp', carregarUsuariosDoBanco);
    return () => window.removeEventListener('atualiza-xp', carregarUsuariosDoBanco);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('familyhub_user_active');
    window.location.href = '/login';
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const navbarStyle = {
    backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff',
    borderBottom: `1px solid ${isDarkMode ? '#404040' : '#edece9'}`,
    color: isDarkMode ? '#ffffff' : '#37352f',
    transition: 'all 0.3s ease'
  };

  const dropdownStyle = {
    backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff',
    borderColor: isDarkMode ? '#404040' : '#edece9',
    color: isDarkMode ? '#ffffff' : '#37352f',
    zIndex: 1000
  };

  return (
    <nav className="navbar px-4 py-2" style={navbarStyle}>
      <div className="container-fluid d-flex justify-content-end align-items-center gap-3">
        
        {/* Botão de Tema */}
        <button 
          onClick={toggleTheme}
          className="btn btn-sm border-0"
          style={{ 
            color: isDarkMode ? '#ffffff' : '#000000', 
            fontSize: '1.2rem', 
            background: 'none',
            padding: '0.25rem 0.5rem'
          }}
          title={isDarkMode ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
        >
          <i className={`bi bi-${isDarkMode ? 'sun-fill' : 'moon-stars-fill'}`}></i>
        </button>

        {/* Botão de Notificações */}
        <div className="position-relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowDropdown(false);
            }}
            className="btn btn-sm border-0 position-relative"
            style={{ color: isDarkMode ? '#ffffff' : '#37352f', fontSize: '1.2rem', background: 'none', padding: '0.25rem 0.5rem' }}
          >
            <i className="bi bi-bell-fill"></i>
            {unreadCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="position-absolute end-0 mt-2 shadow border rounded" style={{ ...dropdownStyle, width: '280px' }}>
              <div className="p-2 border-bottom d-flex justify-content-between align-items-center" style={{ borderColor: isDarkMode ? '#404040' : '#dee2e6' }}>
                <span className="fw-bold small">Notificações</span>
                <button onClick={markAllAsRead} className="btn btn-link btn-sm p-0 text-decoration-none small" style={{ fontSize: '11px', color: isDarkMode ? '#aaa' : '#0d6efd' }}>Marcar todas como lidas</button>
              </div>
              <div className="p-0" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {notifications.length > 0 ? (
                  notifications.map(n => (
                    <div key={n.id} className="p-2 border-bottom" style={{ fontSize: '13px', backgroundColor: !n.read ? (isDarkMode ? '#333' : '#f8f9fa') : 'transparent', borderColor: isDarkMode ? '#404040' : '#dee2e6' }}>
                      <div className="d-flex justify-content-between">
                        <span className={!n.read ? 'fw-bold' : ''}>{n.text}</span>
                      </div>
                      <div className="text-muted" style={{ fontSize: '11px' }}>{n.time}</div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-muted small">Nenhuma notificação</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Perfil do Usuário */}
        <div className="position-relative">
          <div
            onClick={() => {
              setShowDropdown(!showDropdown);
              setShowNotifications(false);
            }}
            style={{ cursor: 'pointer' }}
            className="d-flex align-items-center gap-2"
          >
            <div className="text-end d-none d-md-block">
              <div className="fw-bold" style={{ color: isDarkMode ? '#ffffff' : '#37352f' }}>{usuarioAtual?.nome || 'Usuário'}</div>
              <div className="text-muted" style={{ fontSize: '12px' }}>
                {usuarioAtual?.xp || 0} XP
              </div>
            </div>

            <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
              style={{ width: '35px', height: '35px', backgroundColor: isDarkMode ? '#4a4a4a' : '#37352f' }}>
              {usuarioAtual?.nome?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </div>

          {showDropdown && (
            <div className="position-absolute end-0 mt-2 shadow border rounded" style={{ ...dropdownStyle, width: '150px' }}>
              <div className="p-1">
                <button onClick={handleLogout} className="btn btn-sm w-100 text-start text-danger">
                  <i className="bi bi-box-arrow-right me-2"></i>Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
