import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo2 from '../assets/2.png';

// --- CONFIGURAÇÃO DA API (JavaScript) ---
// Define a URL do endpoint de login da API PHP.
const API_URL_LOGIN = 'http://localhost/FamilyHub/api/login.php';

function Login() {
  // --- ESTADO DO COMPONENTE (JavaScript) ---
  // Gerencia os dados dos campos de input (email, senha), mensagens de erro e o estado de carregamento do formulário.
  // Utiliza o hook `useState` do React para criar e atualizar essas variáveis reativas.
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  // `useNavigate` é usado para redirecionar o usuário para outras páginas após o login.
  const navigate = useNavigate();

  // --- LÓGICA DE AUTENTICAÇÃO (JavaScript) ---
  // Função assíncrona `handleLogin` é acionada ao submeter o formulário.
  // Ela previne o recarregamento da página, limpa erros anteriores e ativa o estado de carregamento.
  // Realiza uma requisição `POST` para a API de login, enviando email e senha em formato JSON.
  // Em caso de sucesso, armazena os dados do usuário no `localStorage` e redireciona para o dashboard.
  // Em caso de falha, exibe uma mensagem de erro. O estado de carregamento é desativado ao final.
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
        localStorage.setItem('familyhub_user_active', JSON.stringify(data.data));
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

  // --- ESTRUTURA E ESTILO DA INTERFACE (JSX, HTML, CSS/Bootstrap) ---
  // O `return` do componente define a estrutura visual da página de login usando JSX (sintaxe similar ao HTML).
  // Estilos são aplicados através de classes do Bootstrap (ex: `d-flex`, `text-center`, `form-control`, `btn`)
  // e também com estilos inline (`style={{...}}`).
  // A logo (`logo2`) é exibida no cabeçalho, e o formulário contém campos para email e senha.
  // Mensagens de erro são exibidas condicionalmente. Há um link para a página de cadastro (`Link` do `react-router-dom`).
  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', backgroundColor: '#b6d7fb' }}>
      <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '8px', border: '1px solid #e174f5', width: '100%', maxWidth: '400px', boxShadow: 'rgba(15, 15, 15, 0.05) 0px 2px 4px' }}>
        
        <div className="text-center mb-4">
          <div style={{ margin: '0 auto 16px' }}>
            <img src={logo2} alt="FamilyHub Logo" style={{ width: '170px', height: '170px', objectFit: 'cover' }} />
          </div>
          <h2 className="fw-bold" style={{ color: '#e174f5', fontSize: '24px' }}>Bem-vindo de volta</h2>
          <p className="text-muted" style={{ fontSize: '14px' }}>Faça login para acessar o FamilyHub</p>
        </div>

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
          <Link to="/cadastro" style={{ color: '#e174f5', textDecoration: 'none', fontWeight: '600' }}>Cadastre-se</Link>
        </div>

      </div>
    </div>
  );
}

export default Login;
