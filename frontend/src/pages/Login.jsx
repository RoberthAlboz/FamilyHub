import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// URL da API corrigida para o padrão do projeto
const API_URL_LOGIN = 'http://localhost/FamilyHub/api/login.php';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      const response = await fetch(API_URL_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const data = await response.json();

      if (data.success) {
        // O backend retorna os dados do usuário em data.data
        localStorage.setItem('familyhub_user_active', JSON.stringify(data.data));
        
        // Manda o usuário para a tela inicial
        navigate('/dashboard');
      } else {
        setErro(data.error || 'Erro ao fazer login. Verifique os dados.');
      }
    } catch (error) {
      console.error("Erro no login:", error);
      setErro('Erro de conexão com o servidor. O XAMPP está ligado?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', backgroundColor: '#f7f7f5' }}>
      <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '8px', border: '1px solid #edece9', width: '100%', maxWidth: '400px', boxShadow: 'rgba(15, 15, 15, 0.05) 0px 2px 4px' }}>
        
        <div className="text-center mb-4">
          <div style={{ width: '48px', height: '48px', backgroundColor: '#37352f', color: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', margin: '0 auto 16px' }}>H</div>
          <h2 className="fw-bold" style={{ color: '#37352f', fontSize: '24px' }}>Bem-vindo de volta</h2>
          <p className="text-muted" style={{ fontSize: '14px' }}>Faça login para acessar o FamilyHub</p>
        </div>

        {/* Exibe mensagem de erro se houver */}
        {erro && (
          <div className="alert alert-danger py-2 px-3 small text-center" role="alert">
            {erro}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label small fw-bold mb-1" style={{ color: '#37352f' }}>E-mail</label>
            <input type="email" className="form-control shadow-none" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label className="form-label small fw-bold mb-1" style={{ color: '#37352f' }}>Senha</label>
            <input type="password" className="form-control shadow-none" placeholder="••••••••" value={senha} onChange={(e) => setSenha(e.target.value)} required />
          </div>
          <button type="submit" className="btn w-100 text-white fw-bold" style={{ backgroundColor: '#37352f', padding: '10px' }} disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-4 text-center" style={{ fontSize: '14px' }}>
          <span style={{ color: '#73726e' }}>Não tem uma conta? </span>
          <Link to="/cadastro" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>Cadastre-se</Link>
        </div>

      </div>
    </div>
  );
}

export default Login;
