import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

function IA() {
  const { isDarkMode } = useTheme();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Olá! Eu sou a IA do FamilyHub. Como posso ajudar sua família hoje?' }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost/FamilyHub/api/gemini.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagem: input })
      });

      const data = await response.json();
      
      if (data.success) {
        setMessages(prev => [...prev, { role: 'ai', text: data.resposta }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: 'Ops, tive um problema ao processar sua mensagem. Verifique se a chave da API está configurada corretamente.' }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Erro de conexão com o servidor.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-4" style={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="p-3 rounded-circle bg-primary bg-opacity-10 text-primary">
          <i className="bi bi-robot fs-4"></i>
        </div>
        <div>
          <h2 className="mb-0 fw-bold" style={{ color: isDarkMode ? '#fff' : '#315884' }}>Assistente IA</h2>
          <p className="text-muted mb-0">Inteligência Artificial integrada ao seu FamilyHub</p>
        </div>
      </div>

      <div className="flex-grow-1 overflow-auto mb-3 p-3 rounded shadow-sm" 
           style={{ backgroundColor: isDarkMode ? '#2d2d2d' : '#f8f9fa', border: `1px solid ${isDarkMode ? '#404040' : '#dee2e6'}` }}>
        {messages.map((msg, index) => (
          <div key={index} className={`d-flex ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'} mb-3`}>
            <div className={`p-3 rounded-3 shadow-sm`} 
                 style={{ 
                   maxWidth: '80%', 
                   backgroundColor: msg.role === 'user' ? '#315884' : (isDarkMode ? '#404040' : '#fff'),
                   color: msg.role === 'user' ? '#fff' : (isDarkMode ? '#eee' : '#333'),
                   border: msg.role === 'ai' ? `1px solid ${isDarkMode ? '#555' : '#eee'}` : 'none'
                 }}>
              <div className="fw-bold small mb-1">{msg.role === 'user' ? 'Você' : 'FamilyHub AI'}</div>
              <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="d-flex justify-content-start mb-3">
            <div className="p-3 rounded-3 bg-light text-muted shadow-sm">
              <div className="spinner-border spinner-border-sm me-2" role="status"></div>
              Pensando...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="d-flex gap-2">
        <input 
          type="text" 
          className={`form-control ${isDarkMode ? 'bg-dark text-white border-secondary' : ''}`}
          placeholder="Pergunte algo sobre as tarefas, finanças ou membros..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className="btn btn-primary px-4" disabled={loading || !input.trim()}>
          <i className="bi bi-send"></i>
        </button>
      </form>
    </div>
  );
}

export default IA;