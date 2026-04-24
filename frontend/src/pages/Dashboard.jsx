import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useTheme } from "../context/ThemeContext";
import { getFeriadosBrasileiros } from "../utils/feriados";

function Dashboard() {
  const { isDarkMode } = useTheme();
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [resumo, setResumo] = useState({
    tarefasAtivas: 0,
    eventosAgenda: 0,
    progressoMetas: 0,
  });
  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [atividades, setAtividades] = useState([]);
  const [proximosEventos, setProximosEventos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const CORES = ["#3b82f6", "#10b981", "#ef4444", "#f59e0b"];

  useEffect(() => {
    const userActive = JSON.parse(localStorage.getItem("familyhub_user_active"));
    if (userActive) setUsuarioLogado(userActive);

    const carregarDashboard = async () => {
      try {
        // 1. Carregar Eventos do Usuário
        const resEventos = await fetch(`http://localhost/FamilyHub/api/eventos.php?membro_id=${userActive?.id}`);
        const eventos = await resEventos.json();
        const listaEventos = Array.isArray(eventos) ? eventos : [];

        // 2. Carregar Feriados
        const anoAtual = new Date().getFullYear();
        const feriados = getFeriadosBrasileiros(anoAtual);

        // 3. Combinar eventos e feriados
        const todosEventos = [...listaEventos, ...feriados];
        const qtdEventos = todosEventos.length;

        // 4. Carregar Tarefas
        const resTarefas = await fetch("http://localhost/FamilyHub/api/tarefas.php");
        const tarefas = await resTarefas.json();
        const listaTarefas = Array.isArray(tarefas) ? tarefas : [];
        
        const tarefasAtivas = listaTarefas.filter(t => t.status === 'pendente').length;
        const tarefasConcluidas = listaTarefas.filter(t => t.status === 'concluida').length;
        const totalTarefas = listaTarefas.length;
        const progresso = totalTarefas > 0 ? Math.round((tarefasConcluidas / totalTarefas) * 100) : 0;

        // 5. Agrupar por Categoria para o Gráfico
        const categorias = listaTarefas.reduce((acc, t) => {
          acc[t.categoria] = (acc[t.categoria] || 0) + 1;
          return acc;
        }, {});
        
        const formatados = Object.keys(categorias).map(cat => ({
          name: cat,
          value: categorias[cat]
        }));

        setDadosGrafico(formatados.length > 0 ? formatados : [{ name: "Sem Tarefas", value: 1 }]);

        setResumo({
          tarefasAtivas,
          eventosAgenda: qtdEventos,
          progressoMetas: progresso
        });

        // 6. Atividades (Últimas 3 tarefas)
        const ultimas = listaTarefas.slice(0, 3).map(t => ({
          id: t.id,
          texto: `Tarefa: ${t.titulo}`,
          tempo: t.status === 'concluida' ? 'Concluída' : 'Pendente',
          cor: t.status === 'concluida' ? '#10b981' : '#3b82f6'
        }));
        setAtividades(ultimas);

        // 7. Próximos eventos (próximos 5 dias)
        const hoje = new Date();
        const proximosDias = todosEventos
          .filter(e => new Date(e.data) >= hoje)
          .sort((a, b) => new Date(a.data) - new Date(b.data))
          .slice(0, 5)
          .map(e => ({
            id: e.id || `feriado-${e.data}`,
            titulo: e.titulo,
            data: new Date(e.data).toLocaleDateString('pt-BR'),
            categoria: e.categoria,
            tipo: e.tipo || 'evento'
          }));

        setProximosEventos(proximosDias);
        
        setCarregando(false);
      } catch (error) {
        console.error("Erro ao carregar dados do Dashboard:", error);
        setCarregando(false);
      }
    };

    carregarDashboard();
  }, []);

  const cardStyle = {
    backgroundColor: isDarkMode ? "#2d2d2d" : "#ffffff",
    border: `1px solid ${isDarkMode ? "#404040" : "#edece9"}`,
    borderRadius: "6px",
    padding: "20px",
    height: "100%",
    boxShadow: isDarkMode ? "none" : "rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 2px 4px",
    color: isDarkMode ? "#ffffff" : "#37352f",
    transition: "all 0.3s ease"
  };

  const textMutedStyle = {
    color: isDarkMode ? "#aaa" : "#73726e"
  };

  return (
    <div>
      <div className="mb-4">
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: isDarkMode ? "#ffffff" : "#37352f" }}>
          Olá, {usuarioLogado ? usuarioLogado.nome : "Família"}! 
        </h1>
        <p style={{ ...textMutedStyle, fontSize: "15px" }}>Visão geral da sua conta e compromissos.</p>
      </div>

      {carregando ? (
        <div className="text-muted">Carregando dados...</div>
      ) : (
        <>
          <div className="row mb-4">
            <div className="col-md-4 mb-3">
              <div style={{ ...cardStyle, borderTop: "3px solid #3b82f6" }}>
                <h3 style={{ fontSize: "14px", fontWeight: "600", ...textMutedStyle, textTransform: "uppercase" }}>Tarefas Pendentes</h3>
                <div style={{ fontSize: "32px", fontWeight: "700", color: isDarkMode ? "#ffffff" : "#37352f", marginTop: "8px" }}>{resumo.tarefasAtivas}</div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div style={{ ...cardStyle, borderTop: "3px solid #ef4444" }}>
                <h3 style={{ fontSize: "14px", fontWeight: "600", ...textMutedStyle, textTransform: "uppercase" }}>Eventos na Agenda</h3>
                <div style={{ fontSize: "32px", fontWeight: "700", color: isDarkMode ? "#ffffff" : "#37352f", marginTop: "8px" }}>{resumo.eventosAgenda}</div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div style={{ ...cardStyle, borderTop: "3px solid #10b981" }}>
                <h3 style={{ fontSize: "14px", fontWeight: "600", ...textMutedStyle, textTransform: "uppercase" }}>Progresso Geral</h3>
                <div style={{ fontSize: "32px", fontWeight: "700", color: isDarkMode ? "#ffffff" : "#37352f", marginTop: "8px" }}>{resumo.progressoMetas}%</div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-4">
              <div style={{ ...cardStyle, minHeight: "350px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "600", color: isDarkMode ? "#ffffff" : "#37352f", marginBottom: "16px" }}>Distribuição por Categoria</h3>
                <div style={{ width: "100%", height: "250px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={dadosGrafico} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {dadosGrafico.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: isDarkMode ? "#333" : "#fff", borderColor: isDarkMode ? "#404040" : "#edece9", color: isDarkMode ? "#fff" : "#000" }} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="col-md-6 mb-4">
              <div style={{ ...cardStyle, minHeight: "350px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "600", color: isDarkMode ? "#ffffff" : "#37352f", marginBottom: "16px" }}>Próximos Eventos</h3>
                <div style={{ borderTop: `1px solid ${isDarkMode ? "#404040" : "#edece9"}`, paddingTop: "12px", display: "flex", flexDirection: "column", gap: "12px", maxHeight: "280px", overflowY: "auto" }}>
                  {proximosEventos.length > 0 ? proximosEventos.map((item) => (
                    <div key={item.id} className="d-flex align-items-center gap-3">
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: item.tipo === 'feriado' ? '#a855f7' : '#3b82f6' }}></div>
                      <div style={{ flex: 1 }}>
                        <span style={{ color: isDarkMode ? "#ffffff" : "#37352f", fontSize: "14px", fontWeight: "500" }}>{item.titulo}</span>
                        <div style={{ color: isDarkMode ? "#aaa" : "#9ca3af", fontSize: "12px" }}>{item.data}</div>
                      </div>
                      <span style={{ color: isDarkMode ? "#aaa" : "#73726e", fontSize: "11px", textTransform: "uppercase", fontWeight: "600" }}>{item.tipo}</span>
                    </div>
                  )) : <div className="text-muted small">Nenhum evento próximo.</div>}
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-md-12 mb-4">
              <div style={{ ...cardStyle }}>
                <h3 style={{ fontSize: "18px", fontWeight: "600", color: isDarkMode ? "#ffffff" : "#37352f", marginBottom: "16px" }}>Atividades Recentes</h3>
                <div style={{ borderTop: `1px solid ${isDarkMode ? "#404040" : "#edece9"}`, paddingTop: "12px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  {atividades.length > 0 ? atividades.map((item) => (
                    <div key={item.id} className="d-flex align-items-center gap-3">
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: item.cor }}></div>
                      <span style={{ color: isDarkMode ? "#ffffff" : "#37352f", fontSize: "14px" }}>{item.texto}</span>
                      <span style={{ color: isDarkMode ? "#aaa" : "#9ca3af", fontSize: "12px", marginLeft: "auto" }}>{item.tempo}</span>
                    </div>
                  )) : <div className="text-muted small">Nenhuma atividade recente.</div>}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
