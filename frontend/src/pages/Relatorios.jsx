import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { getFeriadosBrasileiros } from '../utils/feriados';

function Relatorios() {
  const { isDarkMode } = useTheme();
  const [tarefas, setTarefas] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [feriados, setFeriados] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const userActive = JSON.parse(localStorage.getItem("familyhub_user_active"));
        
        const [resTarefas, resEventos] = await Promise.all([
          fetch("http://localhost/FamilyHub/api/tarefas.php"),
          fetch(`http://localhost/FamilyHub/api/eventos.php?membro_id=${userActive?.id}`)
        ]);

        const dadosTarefas = await resTarefas.json();
        const dadosEventos = await resEventos.json();

        setTarefas(Array.isArray(dadosTarefas) ? dadosTarefas : []);
        setEventos(Array.isArray(dadosEventos) ? dadosEventos : []);

        // Carregar feriados do ano atual
        const anoAtual = new Date().getFullYear();
        const feriadosDo = getFeriadosBrasileiros(anoAtual);
        setFeriados(feriadosDo);
      } catch (error) {
        console.error("Erro ao carregar relatórios:", error);
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, []);

  const totalTarefas = tarefas.length;
  const tarefasConcluidas = tarefas.filter(t => t.status === 'concluida').length;
  const tarefasPendentes = totalTarefas - tarefasConcluidas;
  const progressoTarefas = totalTarefas === 0 ? 0 : Math.round((tarefasConcluidas / totalTarefas) * 100);

  const tarefasAlta = tarefas.filter(t => t.prioridade === 'Alta').length;
  const tarefasMedia = tarefas.filter(t => t.prioridade === 'Média').length;
  const tarefasBaixa = tarefas.filter(t => t.prioridade === 'Baixa').length;

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  
  // Combinar eventos e feriados
  const todosEventos = [...eventos, ...feriados];
  const eventosFuturos = todosEventos.filter(e => new Date(e.data || e.data_evento) >= hoje).length;
  const totalEventos = todosEventos.length;

  const cardStyle = {
    backgroundColor: isDarkMode ? "#2d2d2d" : "#ffffff",
    borderColor: isDarkMode ? "#404040" : "#edece9",
    color: isDarkMode ? "#ffffff" : "#37352f",
    transition: "all 0.3s ease"
  };

  const textMutedStyle = {
    color: isDarkMode ? "#aaa" : "#73726e"
  };

  if (carregando) return <div className="p-5 text-center text-muted">Carregando relatórios...</div>;

  return (
    <div className="container-fluid p-0">
      <div className="mb-4">
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: isDarkMode ? '#ffffff' : '#ad32b5', marginBottom: '8px' }}>Relatórios e Visão Geral</h1>
        <p className="text-muted" style={{ fontSize: '14px' }}>Acompanhe a produtividade e os compromissos da família.</p>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="p-4 rounded border shadow-sm" style={{ ...cardStyle }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="fw-bold small text-uppercase" style={textMutedStyle}>Total de Tarefas</span>
              <i className="bi bi-list-task fs-5 text-primary"></i>
            </div>
            <h2 className="fw-bold mb-0" style={{ color: isDarkMode ? '#ffffff' : '#37352f' }}>{totalTarefas}</h2>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="p-4 rounded border shadow-sm" style={{ ...cardStyle }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="fw-bold small text-uppercase" style={textMutedStyle}>Concluídas</span>
              <i className="bi bi-check2-circle fs-5 text-success"></i>
            </div>
            <h2 className="fw-bold mb-0" style={{ color: isDarkMode ? '#ffffff' : '#37352f' }}>{tarefasConcluidas}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="p-4 rounded border shadow-sm" style={{ ...cardStyle }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="fw-bold small text-uppercase" style={textMutedStyle}>Pendentes</span>
              <i className="bi bi-hourglass-split fs-5 text-warning"></i>
            </div>
            <h2 className="fw-bold mb-0" style={{ color: isDarkMode ? '#ffffff' : '#37352f' }}>{tarefasPendentes}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="p-4 rounded border shadow-sm" style={{ ...cardStyle }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="fw-bold small text-uppercase" style={textMutedStyle}>Eventos Totais</span>
              <i className="bi bi-calendar-event fs-5 text-info"></i>
            </div>
            <h2 className="fw-bold mb-0" style={{ color: isDarkMode ? '#ffffff' : '#37352f' }}>{totalEventos}</h2>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="p-4 rounded border shadow-sm h-100" style={{ ...cardStyle }}>
            <h5 className="fw-bold mb-4" style={{ color: isDarkMode ? '#ffffff' : '#37352f' }}>Progresso das Tarefas</h5>
            <div className="d-flex justify-content-between mb-2">
              <span className="fw-bold small" style={textMutedStyle}>Taxa de Conclusão</span>
              <span className="fw-bold" style={{ color: progressoTarefas >= 50 ? '#198754' : '#dc3545' }}>{progressoTarefas}%</span>
            </div>
            <div className="progress mb-4" style={{ height: '20px', backgroundColor: isDarkMode ? '#333' : '#f7f7f5' }}>
              <div className={`progress-bar progress-bar-striped progress-bar-animated ${progressoTarefas >= 50 ? 'bg-success' : 'bg-danger'}`} role="progressbar" style={{ width: `${progressoTarefas}%` }}></div>
            </div>
            <p className="text-muted small">
              {progressoTarefas === 100 ? "Parabéns! Todas as tarefas foram concluídas." : progressoTarefas >= 50 ? "Mais da metade já foi resolvida!" : "Foquem nas prioridades altas!"}
            </p>
          </div>
        </div>

        <div className="col-md-6">
          <div className="p-4 rounded border shadow-sm h-100" style={{ ...cardStyle }}>
            <h5 className="fw-bold mb-4" style={{ color: isDarkMode ? '#ffffff' : '#37352f' }}>Tarefas por Prioridade</h5>
            <div className="d-flex flex-column gap-3">
              <div>
                <div className="d-flex justify-content-between mb-1">
                  <span className="small fw-bold"><i className="bi bi-exclamation-triangle-fill text-danger me-2"></i>Alta</span>
                  <span className="small" style={textMutedStyle}>{tarefasAlta}</span>
                </div>
                <div className="progress" style={{ height: '8px', backgroundColor: isDarkMode ? '#333' : '#f7f7f5' }}><div className="progress-bar bg-danger" style={{ width: `${totalTarefas === 0 ? 0 : (tarefasAlta/totalTarefas)*100}%` }}></div></div>
              </div>
              <div>
                <div className="d-flex justify-content-between mb-1">
                  <span className="small fw-bold"><i className="bi bi-dash-circle-fill text-warning me-2"></i>Média</span>
                  <span className="small" style={textMutedStyle}>{tarefasMedia}</span>
                </div>
                <div className="progress" style={{ height: '8px', backgroundColor: isDarkMode ? '#333' : '#f7f7f5' }}><div className="progress-bar bg-warning" style={{ width: `${totalTarefas === 0 ? 0 : (tarefasMedia/totalTarefas)*100}%` }}></div></div>
              </div>
              <div>
                <div className="d-flex justify-content-between mb-1">
                  <span className="small fw-bold"><i className="bi bi-arrow-down-circle-fill text-success me-2"></i>Baixa</span>
                  <span className="small" style={textMutedStyle}>{tarefasBaixa}</span>
                </div>
                <div className="progress" style={{ height: '8px', backgroundColor: isDarkMode ? '#333' : '#f7f7f5' }}><div className="progress-bar bg-success" style={{ width: `${totalTarefas === 0 ? 0 : (tarefasBaixa/totalTarefas)*100}%` }}></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-2">
        <div className="col-md-12">
          <div className="p-4 rounded border shadow-sm" style={{ ...cardStyle }}>
            <h5 className="fw-bold mb-4" style={{ color: isDarkMode ? '#ffffff' : '#37352f' }}>Próximos Eventos e Feriados</h5>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {todosEventos.filter(e => new Date(e.data) >= hoje).sort((a, b) => new Date(a.data) - new Date(b.data)).slice(0, 10).length > 0 ? (
                todosEventos.filter(e => new Date(e.data) >= hoje).sort((a, b) => new Date(a.data) - new Date(b.data)).slice(0, 10).map((evento, idx) => (
                  <div key={idx} className="d-flex align-items-center gap-3 mb-3 pb-3" style={{ borderBottom: `1px solid ${isDarkMode ? '#404040' : '#edece9'}` }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: evento.tipo === 'feriado' ? '#a855f7' : '#3b82f6' }}></div>
                    <div style={{ flex: 1 }}>
                      <span style={{ color: isDarkMode ? '#ffffff' : '#37352f', fontSize: '14px', fontWeight: '500' }}>{evento.titulo}</span>
                      <div style={{ color: isDarkMode ? '#aaa' : '#9ca3af', fontSize: '12px' }}>
                        {new Date(evento.data).toLocaleDateString('pt-BR')} • {evento.categoria}
                      </div>
                    </div>
                    <span style={{ color: isDarkMode ? '#aaa' : '#73726e', fontSize: '11px', textTransform: 'uppercase', fontWeight: '600' }}>
                      {evento.tipo === 'feriado' ? 'Feriado' : 'Evento'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-muted small">Nenhum evento próximo.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Relatorios;
