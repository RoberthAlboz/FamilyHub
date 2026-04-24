import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

function Dashboard() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [resumo, setResumo] = useState({
    tarefasAtivas: 0,
    eventosAgenda: 0,
    progressoMetas: 0,
  });
  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [atividades, setAtividades] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const CORES = ["#3b82f6", "#10b981", "#ef4444", "#f59e0b"];

  useEffect(() => {
    const userActive = JSON.parse(localStorage.getItem("familyhub_user_active"));
    if (userActive) setUsuarioLogado(userActive);

    const carregarDashboard = async () => {
      try {
        // 1. Carregar Eventos
        const resEventos = await fetch("http://localhost/FamilyHub/api/eventos.php");
        const eventos = await resEventos.json();
        const qtdEventos = Array.isArray(eventos) ? eventos.length : 0;

        // 2. Carregar Tarefas
        const resTarefas = await fetch("http://localhost/FamilyHub/api/tarefas.php");
        const tarefas = await resTarefas.json();
        const listaTarefas = Array.isArray(tarefas) ? tarefas : [];
        
        const tarefasAtivas = listaTarefas.filter(t => t.status === 'pendente').length;
        const tarefasConcluidas = listaTarefas.filter(t => t.status === 'concluida').length;
        const totalTarefas = listaTarefas.length;
        const progresso = totalTarefas > 0 ? Math.round((tarefasConcluidas / totalTarefas) * 100) : 0;

        // 3. Agrupar por Categoria para o Gráfico
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

        // 4. Atividades (Últimas 3 tarefas ou eventos)
        const ultimas = listaTarefas.slice(0, 3).map(t => ({
          id: t.id,
          texto: `Tarefa: ${t.titulo}`,
          tempo: t.status === 'concluida' ? 'Concluída' : 'Pendente',
          cor: t.status === 'concluida' ? '#10b981' : '#3b82f6'
        }));
        setAtividades(ultimas);
        
        setCarregando(false);
      } catch (error) {
        console.error("Erro ao carregar dados do Dashboard:", error);
        setCarregando(false);
      }
    };

    carregarDashboard();
  }, []);

  const cardStyle = {
    backgroundColor: "#ffffff",
    border: "1px solid #edece9",
    borderRadius: "6px",
    padding: "20px",
    height: "100%",
    boxShadow: "rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 2px 4px",
  };

  return (
    <div>
      <div className="mb-4">
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#37352f" }}>
          Olá, {usuarioLogado ? usuarioLogado.nome : "Família"}! 
        </h1>
        <p style={{ color: "#73726e", fontSize: "15px" }}>Visão geral da sua conta e compromissos.</p>
      </div>

      {carregando ? (
        <div className="text-muted">Carregando dados...</div>
      ) : (
        <>
          <div className="row mb-4">
            <div className="col-md-4 mb-3">
              <div style={{ ...cardStyle, borderTop: "3px solid #3b82f6" }}>
                <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#73726e", textTransform: "uppercase" }}>Tarefas Pendentes</h3>
                <div style={{ fontSize: "32px", fontWeight: "700", color: "#37352f", marginTop: "8px" }}>{resumo.tarefasAtivas}</div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div style={{ ...cardStyle, borderTop: "3px solid #ef4444" }}>
                <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#73726e", textTransform: "uppercase" }}>Eventos na Agenda</h3>
                <div style={{ fontSize: "32px", fontWeight: "700", color: "#37352f", marginTop: "8px" }}>{resumo.eventosAgenda}</div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div style={{ ...cardStyle, borderTop: "3px solid #10b981" }}>
                <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#73726e", textTransform: "uppercase" }}>Progresso Geral</h3>
                <div style={{ fontSize: "32px", fontWeight: "700", color: "#37352f", marginTop: "8px" }}>{resumo.progressoMetas}%</div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-4">
              <div style={{ ...cardStyle, minHeight: "350px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#37352f", marginBottom: "16px" }}>Distribuição por Categoria</h3>
                <div style={{ width: "100%", height: "250px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={dadosGrafico} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {dadosGrafico.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="col-md-6 mb-4">
              <div style={{ ...cardStyle, minHeight: "350px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#37352f", marginBottom: "16px" }}>Atividades Recentes</h3>
                <div style={{ borderTop: "1px solid #edece9", paddingTop: "12px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  {atividades.length > 0 ? atividades.map((item) => (
                    <div key={item.id} className="d-flex align-items-center gap-3">
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: item.cor }}></div>
                      <span style={{ color: "#37352f", fontSize: "14px" }}>{item.texto}</span>
                      <span style={{ color: "#9ca3af", fontSize: "12px", marginLeft: "auto" }}>{item.tempo}</span>
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
