import React, { useState, useEffect } from 'react';

function Tarefas() {
  const [tasks, setTasks] = useState([]);
  const [membros, setMembros] = useState([]);
  
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("Geral");
  const [newTaskPriority, setNewTaskPriority] = useState("Média");
  const [newTaskAssignedTo, setNewTaskAssignedTo] = useState(""); 
  const [newTaskEndDate, setNewTaskEndDate] = useState("");

  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [commentText, setCommentText] = useState("");

  const API_URL = "http://localhost/FamilyHub/api/tarefas.php";
  const MEMBROS_URL = "http://localhost/FamilyHub/api/membros.php";

  const carregarDados = async () => {
    try {
      const resMembros = await fetch(MEMBROS_URL);
      const dadosMembros = await resMembros.json();
      setMembros(dadosMembros.data || dadosMembros);

      const resTasks = await fetch(API_URL);
      const dadosTasks = await resTasks.json();
      setTasks(dadosTasks.data || dadosTasks);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    
    if (!newTaskText.trim() || !newTaskAssignedTo) {
      alert("Preencha o título e selecione um responsável.");
      return;
    }

    const novaTarefa = {
      titulo: newTaskText,
      prioridade: newTaskPriority,
      responsavel_id: Number(newTaskAssignedTo),
      categoria: newTaskCategory,
      data_fim: newTaskEndDate || null
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaTarefa)
      });

      const text = await response.text();

      try {
        const result = JSON.parse(text);
        if (result.success) {
          setNewTaskText("");
          setNewTaskEndDate("");
          setNewTaskAssignedTo("");
          carregarDados();
        } else {
          alert("Erro: " + (result.error || "Erro desconhecido"));
        }
      } catch {
        console.error("Resposta inválida:", text);
      }

    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  const handleToggleTask = async (task, e) => {
    e.stopPropagation();
    const novoStatus = task.status === 'pendente' ? 'concluida' : 'pendente';
    
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acao: 'concluir', id: task.id, status: novoStatus })
      });

      carregarDados();

      // ✅ CORREÇÃO DO XP (evento certo)
      window.dispatchEvent(new Event('atualiza-xp'));

    } catch (error) {
      console.error("Erro ao alternar status:", error);
    }
  };

  const handleRemoveTask = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Excluir esta tarefa?")) return;

    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ acao: 'deletar', id: id })
    });

    if (selectedTaskId === id) setSelectedTaskId(null);
    carregarDados();
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ acao: 'comentar', tarefa_id: selectedTaskId, texto: commentText })
    });

    setCommentText("");
    carregarDados();
  };

  const corPrioridade = (p) => p === 'Alta' ? '#dc3545' : (p === 'Média' ? '#ffc107' : '#198754');
  const selectedTask = tasks.find(t => t.id === selectedTaskId);

  return (
    <div className="container-fluid p-0">
      <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#37352f' }}>Gerenciador de Tarefas</h1>
      <p className="text-muted mb-4">Sincronizado com o MySQL</p>

      <form onSubmit={handleAddTask} className="mb-4 p-3 shadow-sm" style={{ backgroundColor: '#f7f7f5', borderRadius: '8px', border: '1px solid #edece9' }}>
        <div className="row g-3">
          <div className="col-md-12">
            <input type="text" className="form-control border-0" placeholder="Título da tarefa..." value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)} required />
          </div>

          <div className="col-md-3">
            <select className="form-select border-0" value={newTaskAssignedTo} onChange={(e) => setNewTaskAssignedTo(e.target.value)} required>
              <option value="">Responsável...</option>
              {membros.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
            </select>
          </div>

          <div className="col-md-3">
            <select className="form-select border-0" value={newTaskCategory} onChange={(e) => setNewTaskCategory(e.target.value)}>
              <option value="Geral">Geral</option>
              <option value="Mercado">Mercado</option>
              <option value="Financeiro">Financeiro</option>
            </select>
          </div>

          <div className="col-md-2">
            <select className="form-select border-0" value={newTaskPriority} onChange={(e) => setNewTaskPriority(e.target.value)}>
              <option value="Baixa">Baixa</option>
              <option value="Média">Média</option>
              <option value="Alta">Alta</option>
            </select>
          </div>

          <div className="col-md-2">
            <input type="date" className="form-control border-0" value={newTaskEndDate} onChange={(e) => setNewTaskEndDate(e.target.value)} />
          </div>

          <div className="col-md-2 d-grid">
            <button type="submit" className="btn btn-dark">Criar</button>
          </div>
        </div>
      </form>

      <div className="row">
        <div className="col-md-7">
          <div className="d-flex flex-column gap-2">
            {tasks.map(task => (
              <div key={task.id} onClick={() => setSelectedTaskId(task.id)} className="p-3 shadow-sm" style={{ borderRadius: '8px', border: '1px solid #edece9', backgroundColor: selectedTaskId === task.id ? '#f7f7f5' : '#fff', cursor: 'pointer', display: 'flex', gap: '12px' }}>
                
                <input type="checkbox" checked={task.status === 'concluida'} onChange={(e) => handleToggleTask(task, e)} />

                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between">
                    <span style={{ fontWeight: '600', textDecoration: task.status === 'concluida' ? 'line-through' : 'none' }}>
                      {task.titulo}
                    </span>

                    <button onClick={(e) => handleRemoveTask(task.id, e)} className="btn btn-link text-danger p-0">
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>

                  <div className="d-flex gap-3 mt-1" style={{ fontSize: '11px' }}>
                    <span className="badge bg-dark">{task.responsavel_nome || 'ID: ' + task.responsavel_id}</span>
                    <span style={{ color: corPrioridade(task.prioridade), fontWeight: 'bold' }}>{task.prioridade}</span>
                    <span className="text-muted">{task.categoria}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-md-5">
          {selectedTask ? (
            <div className="p-3 border rounded shadow-sm bg-white" style={{ minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
              <h6>Notas: {selectedTask.titulo}</h6>

              <div className="flex-grow-1 overflow-auto mb-3" style={{ maxHeight: '250px' }}>
                {selectedTask.comentarios?.map((c, i) => (
                  <div key={c.id || i} className="mb-2 p-2 rounded bg-light" style={{ fontSize: '12px' }}>
                    <strong>{c.autor}:</strong> {c.texto}
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddComment}>
                <div className="input-group">
                  <input type="text" className="form-control form-control-sm" placeholder="Adicionar nota..." value={commentText} onChange={(e) => setCommentText(e.target.value)} />
                  <button className="btn btn-dark btn-sm">Postar</button>
                </div>
              </form>
            </div>
          ) : (
            <div className="text-center p-5 border rounded bg-light text-muted">
              Selecione uma tarefa para ver as notas.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Tarefas;