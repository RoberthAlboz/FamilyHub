-- FamilyHub: Alterações necessárias no Banco de Dados

-- 1. Criar banco de dados (caso não exista)
CREATE DATABASE IF NOT EXISTS family_hub;
USE family_hub;

-- 2. Tabela de Membros (Usuários)
CREATE TABLE IF NOT EXISTS membros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    xp INT DEFAULT 0,
    papel VARCHAR(50),
    data_nascimento DATE,
    atividades TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela de Tarefas
CREATE TABLE IF NOT EXISTS tarefas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    prioridade ENUM('Baixa', 'Média', 'Alta') DEFAULT 'Média',
    status ENUM('pendente', 'concluida') DEFAULT 'pendente',
    responsavel_id INT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    categoria VARCHAR(50) DEFAULT 'Geral',
    data_fim DATE,
    FOREIGN KEY (responsavel_id) REFERENCES membros(id) ON DELETE SET NULL
);

-- 4. Tabela de Comentários (Notas das Tarefas)
CREATE TABLE IF NOT EXISTS comentarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tarefa_id INT NOT NULL,
    texto TEXT NOT NULL,
    autor VARCHAR(100) DEFAULT 'Você',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tarefa_id) REFERENCES tarefas(id) ON DELETE CASCADE
);

-- 5. Tabela de Eventos (Calendário)
CREATE TABLE IF NOT EXISTS eventos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    membro_id INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    data_evento DATE NOT NULL,
    categoria VARCHAR(50) DEFAULT 'Outro',
    icone VARCHAR(50) DEFAULT 'bi-calendar-event',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (membro_id) REFERENCES membros(id) ON DELETE CASCADE
);

-- 6. Tabela de Finanças (Transações)
CREATE TABLE IF NOT EXISTS transacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    tipo ENUM('receita', 'despesa') NOT NULL,
    data_transacao DATE NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
