import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  // Estados para guardar o que o usuário digita
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  
  // Ferramenta do React Router para trocar de página via código
  const navigate = useNavigate();

  // Função que roda quando o formulário é enviado
  const handleLogin = (e) => {
    e.preventDefault(); // Evita que a página recarregue (padrão do HTML)
    
    // AMANHÃ: Aqui enviaremos os dados para backend/api/auth/login.php
    console.log("Tentando logar com:", email);
    
    // HOJE: Simula o sucesso e joga o usuário pro Dashboard
    navigate('/dashboard');
  };

  return (
    <div 
      className="d-flex align-items-center justify-content-center min-vh-100" 
      style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}
    >
      <div className="card shadow-lg border-0 rounded-4 p-4 p-md-5" style={{ width: '100%', maxWidth: '450px' }}>
        
        {/* Cabeçalho do Login */}
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary mb-1">FamilyHub</h2>
          <p className="text-muted">Conecte-se à sua tribo</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleLogin}>
          
          {/* Campo de Email com Floating Label */}
          <div className="form-floating mb-3">
            <input 
              type="email" 
              className="form-control focus-ring focus-ring-primary" 
              id="emailInput" 
              placeholder="nome@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            <label htmlFor="emailInput">Email</label>
          </div>

          {/* Campo de Senha com Floating Label */}
          <div className="form-floating mb-4">
            <input 
              type="password" 
              className="form-control focus-ring focus-ring-primary" 
              id="senhaInput" 
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required 
            />
            <label htmlFor="senhaInput">Senha</label>
          </div>

          {/* Botão de Ação */}
          <button type="submit" className="btn btn-primary w-100 py-2 mb-4 fw-bold rounded-3 shadow-sm">
            Entrar no Sistema
          </button>

          {/* Rodapé com link para a tela de Cadastro */}
          <div className="text-center">
            <span className="text-muted">Ainda não tem uma família cadastrada? </span>
            <Link to="/cadastro" className="text-decoration-none fw-bold text-primary">
              Criar conta
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Login;