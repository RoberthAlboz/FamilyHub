import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '../context/ThemeContext';

function Financas() {
  const { isDarkMode } = useTheme();
  const [transacoes, setTransacoes] = useState(() => {
    const salvas = localStorage.getItem('familyhub_financas');
    return salvas ? JSON.parse(salvas) : [];
  });

  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("despesa");

  useEffect(() => {
    localStorage.setItem('familyhub_financas', JSON.stringify(transacoes));
  }, [transacoes]);

  const handleAdicionar = (e) => {
    e.preventDefault();
    if (!descricao.trim() || !valor) return;

    const novaTransacao = {
      id: Date.now(),
      descricao,
      valor: parseFloat(valor),
      tipo,
      data: new Date().toLocaleDateString('pt-BR')
    };

    setTransacoes([...transacoes, novaTransacao]);
    setDescricao("");
    setValor("");
  };

  const removerTransacao = (id) => {
    setTransacoes(transacoes.filter(t => t.id !== id));
  };

  // --- LÓGICA DE CÁLCULOS ---
  const totalReceitas = transacoes
    .filter(t => t.tipo === 'receita')
    .reduce((acc, curr) => acc + curr.valor, 0);

  const totalDespesas = transacoes
    .filter(t => t.tipo === 'despesa')
    .reduce((acc, curr) => acc + curr.valor, 0);

  const saldoAtual = totalReceitas - totalDespesas;

  // Agrupamento para o gráfico de tendência
  const dadosAgrupados = transacoes.reduce((acc, t) => {
    if (!acc[t.data]) acc[t.data] = { Receitas: 0, Despesas: 0 };
    if (t.tipo === 'receita') acc[t.data].Receitas += t.valor;
    else acc[t.data].Despesas += t.valor;
    return acc;
  }, {});

  const datasOrdenadas = Object.keys(dadosAgrupados).sort((a, b) => {
    const [dA, mA, aA] = a.split('/');
    const [dB, mB, aB] = b.split('/');
    return new Date(aA, mA - 1, dA) - new Date(aB, mB - 1, dB);
  });

  // --- CONFIGURAÇÃO APEXCHARTS ---
  const optionsBarras = {
    chart: { 
      toolbar: { show: false }, 
      fontFamily: 'inherit',
      background: 'transparent'
    },
    plotOptions: { bar: { borderRadius: 6, columnWidth: '45%', distributed: true } },
    colors: ['#10b981', '#ef4444'],
    xaxis: { 
      categories: ['Receitas', 'Despesas'], 
      axisBorder: { show: false },
      labels: { style: { colors: isDarkMode ? '#aaa' : '#73726e' } }
    },
    dataLabels: { enabled: false },
    tooltip: { 
      y: { formatter: (val) => `R$ ${val.toFixed(2)}` },
      theme: isDarkMode ? 'dark' : 'light'
    },
    grid: { borderColor: isDarkMode ? '#404040' : '#edece9' }
  };

  const optionsLinha = {
    chart: { 
      toolbar: { show: false }, 
      zoom: { enabled: false },
      background: 'transparent'
    },
    colors: ['#10b981', '#ef4444'],
    stroke: { curve: 'smooth', width: 3 },
    xaxis: { 
      categories: datasOrdenadas, 
      axisBorder: { show: false },
      labels: { style: { colors: isDarkMode ? '#aaa' : '#73726e' } }
    },
    markers: { size: 5 },
    grid: { borderColor: isDarkMode ? '#404040' : '#edece9', strokeDashArray: 4 },
    tooltip: { 
      theme: isDarkMode ? 'dark' : 'light'
    }
  };

  const formatarMoeda = (val) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const cardStyle = { 
    backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff', 
    border: `1px solid ${isDarkMode ? '#404040' : '#edece9'}`, 
    borderRadius: '8px', 
    padding: '20px', 
    boxShadow: isDarkMode ? 'none' : 'rgba(15, 15, 15, 0.05) 0px 2px 4px',
    color: isDarkMode ? '#ffffff' : '#37352f',
    transition: 'all 0.3s ease'
  };

  const textMutedStyle = {
    color: isDarkMode ? '#aaa' : '#73726e'
  };

  return (
    <div className="container-fluid p-0">
      <h1 style={{ fontSize: '28px', fontWeight: '700', color: isDarkMode ? '#ffffff' : '#37352f', marginBottom: '24px' }}>Controle Financeiro</h1>

      <div className="row mb-4">
        <div className="col-md-4"><div style={{ ...cardStyle, borderTop: '4px solid #37352f' }}><h6 style={textMutedStyle}>Saldo</h6><h2 style={{color: saldoAtual >= 0 ? '#10b981' : '#ef4444'}}>{formatarMoeda(saldoAtual)}</h2></div></div>
        <div className="col-md-4"><div style={{ ...cardStyle, borderTop: '4px solid #10b981' }}><h6 style={textMutedStyle}>Receitas</h6><h2 style={{color: isDarkMode ? '#ffffff' : '#37352f'}}>{formatarMoeda(totalReceitas)}</h2></div></div>
        <div className="col-md-4"><div style={{ ...cardStyle, borderTop: '4px solid #ef4444' }}><h6 style={textMutedStyle}>Despesas</h6><h2 style={{color: isDarkMode ? '#ffffff' : '#37352f'}}>{formatarMoeda(totalDespesas)}</h2></div></div>
      </div>

      <div className="row">
        <div className="col-md-5 mb-4">
          <div style={cardStyle}>
            <h4 className="mb-4" style={{color: isDarkMode ? '#ffffff' : '#37352f'}}>Nova Transação</h4>
            <form onSubmit={handleAdicionar}>
              <input type="text" className="form-control mb-2" placeholder="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} style={{ backgroundColor: isDarkMode ? '#333' : '#fff', color: isDarkMode ? '#fff' : '#000', borderColor: isDarkMode ? '#444' : '#dee2e6' }} />
              <div className="d-flex gap-2 mb-3">
                <input type="number" className="form-control" placeholder="R$" value={valor} onChange={e => setValor(e.target.value)} style={{ backgroundColor: isDarkMode ? '#333' : '#fff', color: isDarkMode ? '#fff' : '#000', borderColor: isDarkMode ? '#444' : '#dee2e6' }} />
                <select className="form-select" value={tipo} onChange={e => setTipo(e.target.value)} style={{ backgroundColor: isDarkMode ? '#333' : '#fff', color: isDarkMode ? '#fff' : '#000', borderColor: isDarkMode ? '#444' : '#dee2e6' }}>
                  <option value="despesa">Saída</option>
                  <option value="receita">Entrada</option>
                </select>
              </div>
              <button className="btn w-100 text-white" style={{backgroundColor: '#37352f'}}>Adicionar</button>
            </form>
            <hr style={{ borderColor: isDarkMode ? '#404040' : '#edece9' }} />
            <div style={{maxHeight: '300px', overflowY: 'auto'}}>
              {transacoes.slice().reverse().map(t => (
                <div key={t.id} className="d-flex justify-content-between p-2 mb-2 rounded" style={{ backgroundColor: isDarkMode ? '#333' : '#f8f9fa' }}>
                  <span style={{color: isDarkMode ? '#ffffff' : '#37352f'}}>{t.descricao}</span>
                  <span className={t.tipo === 'receita' ? 'text-success' : 'text-danger'}>
                    {t.tipo === 'receita' ? '+' : '-'}{formatarMoeda(t.valor)}
                    <i className="bi bi-trash3 ms-2" style={{cursor: 'pointer', color: isDarkMode ? '#aaa' : '#73726e'}} onClick={() => removerTransacao(t.id)}></i>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-7">
          <div style={{ ...cardStyle, marginBottom: '20px' }}>
            <h4 className="mb-3" style={{color: isDarkMode ? '#ffffff' : '#37352f'}}>Tendência Diária</h4>
            <Chart options={optionsLinha} series={[{name: 'Receitas', data: datasOrdenadas.map(d => dadosAgrupados[d].Receitas)}, {name: 'Despesas', data: datasOrdenadas.map(d => dadosAgrupados[d].Despesas)}]} type="line" height={250} />
          </div>
          <div style={cardStyle}>
            <h4 className="mb-3" style={{color: isDarkMode ? '#ffffff' : '#37352f'}}>Comparativo Total</h4>
            <Chart options={optionsBarras} series={[{name: 'Total', data: [totalReceitas, totalDespesas]}]} type="bar" height={250} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Financas;
