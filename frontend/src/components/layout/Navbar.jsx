import React, { useState, useEffect } from 'react';

const API_URL_MEMBROS = 'http://localhost/FamilyHub/api/membros.php';

function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
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

  return (
    <nav className="navbar px-4 py-2 border-bottom bg-white">
      <div className="container-fluid d-flex justify-content-end align-items-center gap-4">
        <div className="position-relative">
          <div
            onClick={() => setShowDropdown(!showDropdown)}
            style={{ cursor: 'pointer' }}
            className="d-flex align-items-center gap-2"
          >
            <div className="text-end d-none d-md-block">
              <div className="fw-bold" style={{ color: '#37352f' }}>{usuarioAtual?.nome || 'Usuário'}</div>
              <div className="text-muted" style={{ fontSize: '12px' }}>
                {usuarioAtual?.xp || 0} XP
              </div>
            </div>

            <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
              style={{ width: '35px', height: '35px', backgroundColor: '#37352f' }}>
              {usuarioAtual?.nome?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </div>

          {showDropdown && (
            <div className="position-absolute end-0 mt-2 shadow border rounded bg-white" style={{ width: '150px', zIndex: 1000 }}>
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
