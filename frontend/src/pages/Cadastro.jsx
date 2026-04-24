import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo2 from '../assets/2.png';

// URL da API para cadastro
const API_URL_CADASTRO = 'http://localhost/FamilyHub/api/cadastro.php';

function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      const response = await fetch(API_URL_CADASTRO, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
      });

      const data = await response.json();

      if (data.success) {
        // Se cadastrou com sucesso, vai para o login!
        navigate('/login');
      } else {
        setErro(data.error || 'Erro ao cadastrar. Verifique os dados e tente novamente.');
      }
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      setErro('Erro de conexão com o servidor. O XAMPP está ligado?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', backgroundColor: '#f7f7f5' }}>
      <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '8px', border: '1px solid #edece9', width: '100%', maxWidth: '400px', boxShadow: 'rgba(15, 15, 15, 0.05) 0px 2px 4px' }}>
        
        <div className="text-center mb-4">
          <div style={{ margin: '0 auto 16px' }}>
            <img src={logo2} alt="FamilyHub Logo" style={{ width: '120px', height: '120px', objectFit: 'contain' }} />
          </div>
          <h2 className="fw-bold" style={{ color: '#37352f', fontSize: '24px' }}>Criar Conta</h2>
          <p className="text-muted" style={{ fontSize: '14px' }}>Comece a organizar sua família hoje</p>
        </div>

        {/* Exibe mensagem de erro se houver */}
        {erro && (
          <div className="alert alert-danger py-2 px-3 small text-center" role="alert">
            {erro}
          </div>
        )}

        <form onSubmit={handleCadastro}>
          <div className="mb-3">
            <label className="form-label small fw-bold mb-1" style={{ color: '#37352f' }}>Nome Completo</label>
            <input type="text" className="form-control shadow-none" placeholder="Como devemos te chamar?" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-bold mb-1" style={{ color: '#37352f' }}>E-mail</label>
            <input type="email" className="form-control shadow-none" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label className="form-label small fw-bold mb-1" style={{ color: '#37352f' }}>Crie uma Senha</label>
            <input type="password" className="form-control shadow-none" placeholder="Pelo menos 6 caracteres" value={senha} onChange={(e) => setSenha(e.target.value)} minLength={6} required />
          </div>
          <button type="submit" className="btn w-100 text-white fw-bold" style={{ backgroundColor: '#37352f', padding: '10px' }} disabled={loading}>
            {loading ? 'Criando conta...' : 'Criar minha conta'}
          </button>
        </form>

        <div className="mt-4 text-center" style={{ fontSize: '14px' }}>
          <span style={{ color: '#73726e' }}>Já tem uma conta? </span>
          <Link to="/login" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>Faça Login</Link>
        </div>

      </div>
    </div>
  );
}

export default Cadastro;
