import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';

const API_URL_MEMBROS = 'http://localhost/FamilyHub/api/membros.php';
const API_URL_UPLOAD_FOTO = 'http://localhost/FamilyHub/api/upload_foto.php';
const API_BASE = 'http://localhost/FamilyHub/api/';

function Navbar( ) {
  const { isDarkMode, toggleTheme } = useTheme();
  const { notifications, markAllAsRead } = useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [usuarioAtual, setUsuarioAtual] = useState(null);
  const [uploadingFoto, setUploadingFoto] = useState(false);
  const fileInputRef = useRef(null);

  const carregarUsuariosDoBanco = async () => {
    try {
      const response = await fetch(API_URL_MEMBROS);
      if (!response.ok) throw new Error('Erro na resposta da API');
      
      const lista = await response.json();
      const saved = localStorage.getItem('familyhub_user_active');
      const logadoSalvo = saved ? JSON.parse(saved) : null;

      if (Array.isArray(lista) && logadoSalvo) {
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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !usuarioAtual?.id) return;
    setUploadingFoto(true);
    try {
      const formData = new FormData();
      formData.append('foto', file);
      formData.append('id', usuarioAtual.id);
      const response = await fetch(API_URL_UPLOAD_FOTO, { method: 'POST', body: formData });
      const result = await response.json();
      if (result.success) {
        setUsuarioAtual(prev => ({ ...prev, foto_perfil: result.foto_perfil }));
        window.dispatchEvent(new Event('atualiza-xp'));
      } else {
        alert('Erro: ' + result.error);
      }
    } catch (error) {
      alert('Erro de conexão.');
    } finally {
      setUploadingFoto(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const fotoUrl = usuarioAtual?.foto_perfil ? `${API_BASE}${usuarioAtual.foto_perfil}` : null;

  const dropdownStyle = {
    backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff',
    borderColor: isDarkMode ? '#404040' : '#edece9',
    color: isDarkMode ? '#ffffff' : '#1aa3d0',
    zIndex: 1000
  };

  return (
    <nav className="navbar px-4 py-2" style={{
      backgroundColor: isDarkMode ? '#2d2d2d' : '#f5e8ff',
      borderBottom: `1px solid ${isDarkMode ? '#404040' : '#93658e'}`,
      color: isDarkMode ? '#ffffff' : '#241c03',
      transition: 'all 0.3s ease'
    }}>
      <div className="container-fluid d-flex justify-content-end align-items-center gap-3">
        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />

        {/* Botão Tema */}
        <button onClick={toggleTheme} className="btn btn-sm border-0" style={{ color: isDarkMode ? '#ffffff' : '#143f7c', fontSize: '1.2rem', background: 'none' }}>
          <i className={`bi bi-${isDarkMode ? 'sun-fill' : 'moon-stars-fill'}`}></i>
        </button>

        {/* Notificações */}
        <div className="position-relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowDropdown(false);
            }} 
            className="btn btn-sm border-0 position-relative" 
            style={{ color: isDarkMode ? '#ffffff' : '#143f7c', fontSize: '1.2rem', background: 'none' }}
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
                <button onClick={markAllAsRead} className="btn btn-link btn-sm p-0 text-decoration-none small" style={{ fontSize: '11px', color: isDarkMode ? '#aaa' : '#0b2955' }}>Marcar todas como lidas</button>
              </div>
              <div className="p-0" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {notifications.length > 0 ? (
                  notifications.map(n => (
                    <div key={n.id} className="p-2 border-bottom" style={{ fontSize: '13px', backgroundColor: !n.read ? (isDarkMode ? '#333' : '#ffffff') : 'transparent', borderColor: isDarkMode ? '#404040' : '#126ac2' }}>
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

        {/* Perfil */}
        <div className="position-relative">
          <div onClick={() => { setShowDropdown(!showDropdown); setShowNotifications(false); }} style={{ cursor: 'pointer' }} className="d-flex align-items-center gap-2">
            <div className="text-end d-none d-md-block">
              <div className="fw-bold">{usuarioAtual?.nome || 'Usuário'}</div>
              <div className="text-muted" style={{ fontSize: '12px' }}>{usuarioAtual?.xp || 0} XP</div>
            </div>

            <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold overflow-hidden"
              style={{ 
                width: '35px', 
                height: '35px', 
                backgroundColor: isDarkMode ? '#4a4a4a' : '#37352f',
                position: 'relative' 
              }}>
              
              {fotoUrl ? (
                <img 
                  src={fotoUrl} 
                  alt="Perfil" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <span>{uploadingFoto ? '...' : (usuarioAtual?.nome?.charAt(0)?.toUpperCase() || 'U')}</span>
              )}
            </div>
          </div>

          {showDropdown && (
            <div className="position-absolute end-0 mt-2 shadow border rounded p-1" style={{ ...dropdownStyle, width: '180px' }}>
              <button onClick={() => fileInputRef.current.click()} className="btn btn-sm w-100 text-start d-flex align-items-center gap-2" style={{ color: isDarkMode ? '#fff' : '#37352f', background: 'none', border: 'none', padding: '8px 12px' }}>
                <i className="bi bi-camera"></i> Alterar foto
              </button>
              <hr style={{ margin: '4px 0', borderColor: isDarkMode ? '#404040' : '#edece9' }} />
              <button onClick={handleLogout} className="btn btn-sm w-100 text-start text-danger d-flex align-items-center gap-2" style={{ background: 'none', border: 'none', padding: '8px 12px' }}>
                <i className="bi bi-box-arrow-right"></i> Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
