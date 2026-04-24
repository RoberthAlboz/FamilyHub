import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const API_URL_MEMBROS = 'http://localhost/FamilyHub/api/membros.php';

function Membros() {
  const { isDarkMode } = useTheme();
  const [membros, setMembros] = useState([]);
  const [nome, setNome] = useState("");
  const [papel, setPapel] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [atividades, setAtividades] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const carregarMembros = async () => {
    try {
      const response = await fetch(API_URL_MEMBROS);
      const data = await response.json();
      setMembros(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar membros:", error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarMembros();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome || !papel) return;

    alert("O cadastro de novos membros requer extensão da API PHP. Por enquanto, os membros são criados via tela de Cadastro de Usuário.");
    
    setNome(""); setPapel(""); setNascimento(""); setAtividades("");
  };

  const excluirMembro = (id) => {
    alert("A remoção de membros deve ser feita diretamente no banco de dados por segurança nesta versão.");
  };

  const cardStyle = { 
    backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff', 
    border: `1px solid ${isDarkMode ? '#404040' : '#edece9'}`, 
    borderRadius: '8px', 
    padding: '24px', 
    boxShadow: isDarkMode ? 'none' : 'rgba(15, 15, 15, 0.05) 0px 2px 4px',
    color: isDarkMode ? '#ffffff' : '#37352f',
    transition: 'all 0.3s ease'
  };

  const textMutedStyle = {
    color: isDarkMode ? '#aaa' : '#73726e'
  };

  return (
    <div className="container-fluid p-0">
      <h1 style={{ fontSize: '28px', fontWeight: '700', color: isDarkMode ? '#ffffff' : '#37352f', marginBottom: '24px' }}>Membros da Família</h1>

      <div className="row">
        <div className="col-md-4 mb-4">
          <div style={cardStyle}>
            <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: isDarkMode ? '#ffffff' : '#37352f' }}>Informações</h4>
            <p className="small" style={textMutedStyle}>Os membros da família são os usuários cadastrados no sistema. Cada integrante pode acumular XP ao completar tarefas.</p>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold">Nome</label>
                <input type="text" className="form-control shadow-none" value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: João Silva" required style={{ backgroundColor: isDarkMode ? '#333' : '#fff', color: isDarkMode ? '#fff' : '#000', borderColor: isDarkMode ? '#444' : '#dee2e6' }} />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">Papel na Família</label>
                <select className="form-select shadow-none" value={papel} onChange={e => setPapel(e.target.value)} required style={{ backgroundColor: isDarkMode ? '#333' : '#fff', color: isDarkMode ? '#fff' : '#000', borderColor: isDarkMode ? '#444' : '#dee2e6' }}>
                  <option value="">Selecione...</option>
                  <option value="Pai">Pai</option>
                  <option value="Mãe">Mãe</option>
                  <option value="Filho(a)">Filho(a)</option>
                  <option value="Avô/Avó">Avô/Avó</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              <button type="submit" className="btn w-100 text-white" style={{ backgroundColor: '#37352f' }}>Atualizar Info (Em breve)</button>
            </form>
          </div>
        </div>

        <div className="col-md-8">
          <div style={cardStyle}>
            <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: isDarkMode ? '#ffffff' : '#37352f' }}>Integrantes no MySQL</h4>
            <div className="table-responsive">
              <table className="table align-middle" style={{ color: isDarkMode ? '#ffffff' : '#37352f' }}>
                <thead>
                  <tr style={{ color: isDarkMode ? '#aaa' : '#acaba9', fontSize: '14px', borderColor: isDarkMode ? '#404040' : '#dee2e6' }}>
                    <th>Membro</th>
                    <th>Nível (XP)</th>
                    <th className="text-end">Ações</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: '14px', borderColor: isDarkMode ? '#404040' : '#dee2e6' }}>
                  {carregando ? (
                    <tr><td colSpan="3" className="text-center py-4">Carregando...</td></tr>
                  ) : membros.length === 0 ? (
                    <tr><td colSpan="3" className="text-center py-4 text-muted">Nenhum membro encontrado.</td></tr>
                  ) : (
                    membros.map(m => (
                      <tr key={m.id} style={{ borderColor: isDarkMode ? '#404040' : '#dee2e6' }}>
                        <td><div className="fw-bold">{m.nome}</div></td>
                        <td><span className="badge" style={{ backgroundColor: isDarkMode ? '#4a4a4a' : '#37352f' }}>{m.xp} XP</span></td>
                        <td className="text-end">
                          <button className="btn btn-sm btn-outline-danger" onClick={() => excluirMembro(m.id)} style={{ borderColor: isDarkMode ? '#dc3545' : '#dc3545', color: isDarkMode ? '#dc3545' : '#dc3545' }}>
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Membros;
