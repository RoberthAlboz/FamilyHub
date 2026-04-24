import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

function Conquistas() {
  const { isDarkMode } = useTheme();
  const [membros, setMembros] = useState([]);
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  const API_URL = "http://localhost/FamilyHub/api/membros.php";

  const recompensas = [
    {
      id: 1,
      nome: "Escolher o Filme",
      custo: 100,
      icon: "bi-film",
      desc: "Direito a escolher o que a família assistirá hoje.",
    },
    {
      id: 2,
      nome: "Dono da TV",
      custo: 150,
      icon: "bi-tv",
      desc: "Uso prioritário da TV/Console por 2 horas.",
    },
    {
      id: 3,
      nome: "Folga da Louça",
      custo: 300,
      icon: "bi-cup-hot",
      desc: "Pule a sua vez de lavar a louça.",
    },
    {
      id: 4,
      nome: "Mestre do Cardápio",
      custo: 200,
      icon: "bi-cart4",
      desc: "Escolha o jantar ou o lugar do delivery.",
    },
    {
      id: 5,
      nome: "Soneca Extra",
      custo: 250,
      icon: "bi-moon-stars",
      desc: "Direito a 1h extra de sono sem ser incomodado.",
    },
    {
      id: 6,
      nome: "Controle do Ar",
      custo: 50,
      icon: "bi-snow",
      desc: "Decida a temperatura do ar-condicionado.",
    },
  ];

  useEffect(() => {
    carregarDados();
    window.addEventListener("storage", carregarDados);
    return () => window.removeEventListener("storage", carregarDados);
  }, []);

  const carregarDados = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) throw new Error("Erro na API");

      const data = await response.json();

      const listaOrdenada = [...data].sort((a, b) => b.xp - a.xp);
      setMembros(listaOrdenada);

      const userActive = JSON.parse(
        localStorage.getItem("familyhub_user_active")
      );

      if (userActive) {
        const atualizado = data.find(
          (m) => String(m.id) === String(userActive.id)
        );

        const userFinal = atualizado || userActive;

        setUsuarioLogado(userFinal);

        localStorage.setItem(
          "familyhub_user_active",
          JSON.stringify(userFinal)
        );
      } else if (data.length > 0) {
        setUsuarioLogado(data[0]);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do MySQL:", error);
    }
  };

  const trocarXP = async (recompensa) => {
    if (!usuarioLogado) return alert("Selecione um usuário.");

    if (usuarioLogado.xp < recompensa.custo) {
      alert(
        `XP insuficiente! Faltam ${recompensa.custo - usuarioLogado.xp} XP.`
      );
      return;
    }

    if (
      window.confirm(`Trocar ${recompensa.custo} XP por: ${recompensa.nome}?`)
    ) {
      try {
        const novoXP = usuarioLogado.xp - recompensa.custo;

        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: usuarioLogado.id,
            novoXP: novoXP,
          }),
        });

        const res = await response.json();

        if (res.success) {
          window.dispatchEvent(
            new CustomEvent("nova-notificacao", {
              detail: `Resgate realizado: ${recompensa.nome}!`,
            })
          );

          window.dispatchEvent(new Event("atualiza-xp"));

          carregarDados();
        } else {
          alert("Erro ao processar resgate no banco de dados.");
        }
      } catch (error) {
        console.error("Erro na transação:", error);
      }
    }
  };

  const calcularNivel = (points) => Math.floor((points || 0) / 100) + 1;
  const progressoNivel = (usuarioLogado?.xp || 0) % 100;
  const nivelAtual = calcularNivel(usuarioLogado?.xp);

  const cardStyle = {
    backgroundColor: isDarkMode ? "#2d2d2d" : "#ffffff",
    borderColor: isDarkMode ? "#404040" : "#edece9",
    color: isDarkMode ? "#ffffff" : "#37352f",
    transition: "all 0.3s ease"
  };

  const textMutedStyle = {
    color: isDarkMode ? "#aaa" : "#73726e"
  };

  return (
    <div className="container-fluid p-0">
      <div className="mb-4">
        <h1 style={{ fontSize: "26px", fontWeight: "700", color: isDarkMode ? "#ffffff" : "#37352f" }}>
          <i className="bi bi-trophy-fill me-2" style={{ color: isDarkMode ? "#ffffff" : "#37352f" }}></i> Conquistas e Recompensas
        </h1>
        <p className="text-muted small">
          Dados sincronizados com MySQL via PHP.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div
            className="p-4 rounded border shadow-sm mb-4"
            style={{ ...cardStyle }}
          >
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold"
                  style={{ width: "55px", height: "55px", fontSize: "20px", backgroundColor: isDarkMode ? "#4a4a4a" : "#37352f" }}
                >
                  {nivelAtual}
                </div>
                <div>
                  <h5 className="mb-0 fw-bold" style={{ color: isDarkMode ? "#ffffff" : "#37352f" }}>
                    {usuarioLogado?.nome || "Carregando..."}
                  </h5>
                  <span className="text-muted small">
                    Saldo no Banco: <strong>{usuarioLogado?.xp || 0} XP</strong>
                  </span>
                </div>
              </div>
              <div className="text-end">
                <div
                  className="small fw-bold text-uppercase"
                  style={{ fontSize: "10px", ...textMutedStyle }}
                >
                  Progresso
                </div>
                <div className="small fw-bold" style={{ color: isDarkMode ? "#ffffff" : "#37352f" }}>{progressoNivel}/100 XP</div>
              </div>
            </div>

            <div
              className="progress"
              style={{ height: "10px", backgroundColor: isDarkMode ? "#333" : "#f7f7f5" }}
            >
              <div
                className="progress-bar"
                style={{ width: `${progressoNivel}%`, backgroundColor: isDarkMode ? "#4a4a4a" : "#37352f" }}
              ></div>
            </div>
          </div>

          <h6 className="fw-bold mb-3 text-uppercase small" style={textMutedStyle}>
            Loja de Benefícios
          </h6>

          <div className="row g-3 mb-5">
            {recompensas.map((item) => (
              <div key={item.id} className="col-md-6">
                <div
                  className="p-3 rounded border h-100 d-flex flex-column justify-content-between"
                  style={{ ...cardStyle }}
                >
                  <div className="d-flex align-items-start gap-3 mb-3">
                    <div
                      className="rounded d-flex align-items-center justify-content-center"
                      style={{ minWidth: "45px", height: "45px", backgroundColor: isDarkMode ? "#333" : "#f8f9fa" }}
                    >
                      <i
                        className={`bi ${item.icon}`}
                        style={{ fontSize: "20px", color: isDarkMode ? "#ffffff" : "#37352f" }}
                      ></i>
                    </div>
                    <div>
                      <div className="fw-bold" style={{ fontSize: "14px", color: isDarkMode ? "#ffffff" : "#37352f" }}>
                        {item.nome}
                      </div>
                      <div className="text-muted" style={{ fontSize: "12px" }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => trocarXP(item)}
                    className={`btn btn-sm w-100 ${
                      usuarioLogado?.xp >= item.custo
                        ? isDarkMode ? "btn-light text-dark" : "btn-dark"
                        : "btn-light text-muted"
                    }`}
                    disabled={!usuarioLogado || usuarioLogado.xp < item.custo}
                    style={{
                      backgroundColor: usuarioLogado?.xp >= item.custo 
                        ? (isDarkMode ? "#ffffff" : "#37352f")
                        : (isDarkMode ? "#333" : "#f8f9fa"),
                      color: usuarioLogado?.xp >= item.custo 
                        ? (isDarkMode ? "#000" : "#fff")
                        : (isDarkMode ? "#aaa" : "#73726e"),
                      borderColor: isDarkMode ? "#444" : "#dee2e6"
                    }}
                  >
                    {usuarioLogado?.xp >= item.custo
                      ? `Resgatar (${item.custo} XP)`
                      : `Faltam ${
                          item.custo - (usuarioLogado?.xp || 0)
                        } XP`}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-lg-4">
          <div
            className="p-4 rounded border shadow-sm"
            style={{ ...cardStyle }}
          >
            <h6 className="fw-bold mb-4 text-uppercase small" style={textMutedStyle}>
              Ranking Global
            </h6>

            <div className="d-flex flex-column gap-2">
              {membros.map((m, i) => (
                <div
                  key={m.id || i}
                  className="d-flex align-items-center justify-content-between p-2 rounded"
                  style={{
                    backgroundColor:
                      m.id === usuarioLogado?.id
                        ? (isDarkMode ? "#333" : "#f7f7f5")
                        : "transparent",
                  }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <span
                      className="fw-bold small"
                      style={{ width: "20px", ...textMutedStyle }}
                    >
                      {i + 1}º
                    </span>
                    <div className="fw-bold" style={{ fontSize: "13px", color: isDarkMode ? "#ffffff" : "#37352f" }}>
                      {m.nome}
                    </div>
                  </div>
                  <span className="badge" style={{ backgroundColor: isDarkMode ? "#333" : "#f7f7f5", color: isDarkMode ? "#ffffff" : "#000", border: `1px solid ${isDarkMode ? "#444" : "#dee2e6"}` }}>
                    {m.xp} XP
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Conquistas;
