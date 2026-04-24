import React, { useState, useEffect } from 'react';

const API_URL_EVENTOS = 'http://localhost/FamilyHub/api/eventos.php';

function Calendario() {
  const [dataAtual, setDataAtual] = useState(new Date());
  const [eventos, setEventos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [novoEvento, setNovoEvento] = useState({ 
    titulo: '', 
    data: '', 
    categoria: 'Outro',
    icone: 'bi-calendar-event'
  });

  let usuarioLogado = null;
  try {
    const saved = localStorage.getItem('familyhub_user_active');
    usuarioLogado = saved ? JSON.parse(saved) : null;
  } catch {
    usuarioLogado = null;
  }

  const categorias = {
    Feriado: { cor: '#a855f7' },
    Escolar: { cor: '#3b82f6' },
    Esporte: { cor: '#10b981' },
    Social:  { cor: '#f59e0b' },
    Saúde:   { cor: '#ef4444' },
    Outro:   { cor: '#6b7280' } 
  };

  const diasDaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  const carregarEventos = async () => {
    if (usuarioLogado) {
      try {
        const res = await fetch(`${API_URL_EVENTOS}?membro_id=${usuarioLogado.id}`);
        const data = await res.json();
        setEventos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erro ao buscar eventos:", err);
      }
    }
  };

  useEffect(() => {
    carregarEventos();
  }, []);

  const handleProximoMes = () => {
    setDataAtual(new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 1));
  };

  const handleMesAnterior = () => {
    setDataAtual(new Date(dataAtual.getFullYear(), dataAtual.getMonth() - 1, 1));
  };

  const salvarEvento = async (e) => {
    e.preventDefault();
    if (!novoEvento.titulo || !novoEvento.data) return;

    try {
      const res = await fetch(API_URL_EVENTOS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...novoEvento, membro_id: usuarioLogado.id })
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setNovoEvento({ titulo: '', data: '', categoria: 'Outro', icone: 'bi-calendar-event' });
        carregarEventos();
      }
    } catch (err) {
      console.error("Erro ao salvar evento:", err);
    }
  };

  const excluirEvento = async (id) => {
    if (!window.confirm("Excluir este evento?")) return;
    try {
      const res = await fetch(API_URL_EVENTOS, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) carregarEventos();
    } catch (err) {
      console.error("Erro ao excluir evento:", err);
    }
  };

  const renderDias = () => {
    const ano = dataAtual.getFullYear();
    const mes = dataAtual.getMonth();
    const primeiroDia = new Date(ano, mes, 1).getDay();
    const diasNoMes = new Date(ano, mes + 1, 0).getDate();
    
    const dias = [];
    for (let i = 0; i < primeiroDia; i++) {
      dias.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let d = 1; d <= diasNoMes; d++) {
      const dataStr = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const eventosDoDia = eventos.filter(e => e.data === dataStr);
      
      dias.push(
        <div key={d} className="calendar-day border p-1" style={{ minHeight: '100px', backgroundColor: '#fff' }}>
          <div className="fw-bold small mb-1">{d}</div>
          <div className="d-flex flex-column gap-1">
            {eventosDoDia.map(e => (
              <div 
                key={e.id} 
                className="event-badge p-1 rounded text-white truncate small d-flex justify-content-between align-items-center"
                style={{ backgroundColor: categorias[e.categoria]?.cor || '#6b7280', fontSize: '10px' }}
              >
                <span><i className={`bi ${e.icone} me-1`}></i>{e.titulo}</span>
                <i className="bi bi-x cursor-pointer" onClick={() => excluirEvento(e.id)}></i>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return dias;
  };

  if (!usuarioLogado) {
    return <div className="p-5 text-center"><h5>Faça login para acessar o calendário.</h5></div>;
  }

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#37352f' }}>Calendário Familiar</h1>
          <p className="text-muted">{meses[dataAtual.getMonth()]} de {dataAtual.getFullYear()}</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm" onClick={handleMesAnterior}><i className="bi bi-chevron-left"></i></button>
          <button className="btn btn-outline-secondary btn-sm" onClick={handleProximoMes}><i className="bi bi-chevron-right"></i></button>
          <button className="btn btn-dark btn-sm ms-2" onClick={() => setShowModal(true)}><i className="bi bi-plus-lg me-1"></i> Novo Evento</button>
        </div>
      </div>

      <div className="calendar-grid shadow-sm rounded overflow-hidden" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', border: '1px solid #edece9' }}>
        {diasDaSemana.map(d => (
          <div key={d} className="bg-light p-2 text-center fw-bold border-bottom small" style={{ color: '#73726e' }}>{d}</div>
        ))}
        {renderDias()}
      </div>

      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Novo Compromisso</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={salvarEvento}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Título</label>
                    <input type="text" className="form-control" value={novoEvento.titulo} onChange={e => setNovoEvento({...novoEvento, titulo: e.target.value})} required />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-bold">Data</label>
                      <input type="date" className="form-control" value={novoEvento.data} onChange={e => setNovoEvento({...novoEvento, data: e.target.value})} required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-bold">Categoria</label>
                      <select className="form-select" value={novoEvento.categoria} onChange={e => setNovoEvento({...novoEvento, categoria: e.target.value})}>
                        {Object.keys(categorias).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-dark">Agendar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .calendar-day { border-right: 1px solid #edece9; border-bottom: 1px solid #edece9; }
        .calendar-day:nth-child(7n) { border-right: none; }
        .truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .cursor-pointer { cursor: pointer; }
      `}</style>
    </div>
  );
}

export default Calendario;
