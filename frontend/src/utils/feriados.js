// Lista de feriados brasileiros fixos e móveis para 2024-2026
export const getFeriadosBrasileiros = (ano) => {
  const feriados = [];

  // Feriados fixos
  const feriadosFixos = [
    { mes: 0, dia: 1, nome: 'Ano Novo' },
    { mes: 3, dia: 21, nome: 'Tiradentes' },
    { mes: 4, dia: 1, nome: 'Dia do Trabalho' },
    { mes: 8, dia: 7, nome: 'Independência do Brasil' },
    { mes: 9, dia: 12, nome: 'Nossa Senhora Aparecida' },
    { mes: 10, dia: 2, nome: 'Finados' },
    { mes: 10, dia: 15, nome: 'Proclamação da República' },
    { mes: 10, dia: 20, nome: 'Consciência Negra' },
    { mes: 11, dia: 25, nome: 'Natal' }
  ];

  // Adicionar feriados fixos
  feriadosFixos.forEach(feriado => {
    const data = new Date(ano, feriado.mes, feriado.dia);
    feriados.push({
      data: `${ano}-${String(feriado.mes + 1).padStart(2, '0')}-${String(feriado.dia).padStart(2, '0')}`,
      titulo: feriado.nome,
      categoria: 'Feriado',
      icone: 'bi-calendar-event',
      tipo: 'feriado'
    });
  });

  // Feriados móveis (Páscoa e relacionados)
  const feriadosMoveis = calcularFeriadosMoveis(ano);
  feriados.push(...feriadosMoveis);

  return feriados;
};

// Calcular feriados móveis baseado na Páscoa
function calcularFeriadosMoveis(ano) {
  const feriados = [];
  const pascoa = calcularPascoa(ano);
  
  // Sexta-feira Santa (2 dias antes da Páscoa)
  const sextaFeira = new Date(pascoa);
  sextaFeira.setDate(sextaFeira.getDate() - 2);
  feriados.push({
    data: formatarData(sextaFeira),
    titulo: 'Sexta-feira Santa',
    categoria: 'Feriado',
    icone: 'bi-calendar-event',
    tipo: 'feriado'
  });

  // Corpus Christi (39 dias depois da Páscoa)
  const corpusChrist = new Date(pascoa);
  corpusChrist.setDate(corpusChrist.getDate() + 39);
  feriados.push({
    data: formatarData(corpusChrist),
    titulo: 'Corpus Christi',
    categoria: 'Feriado',
    icone: 'bi-calendar-event',
    tipo: 'feriado'
  });

  // Carnaval (47 dias antes da Páscoa)
  const carnaval = new Date(pascoa);
  carnaval.setDate(carnaval.getDate() - 47);
  feriados.push({
    data: formatarData(carnaval),
    titulo: 'Carnaval',
    categoria: 'Feriado',
    icone: 'bi-calendar-event',
    tipo: 'feriado'
  });

  return feriados;
}

// Algoritmo de Computus para calcular a Páscoa
function calcularPascoa(ano) {
  const a = ano % 19;
  const b = Math.floor(ano / 100);
  const c = ano % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mes = Math.floor((h + l - 7 * m + 114) / 31);
  const dia = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(ano, mes - 1, dia);
}

function formatarData(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}
