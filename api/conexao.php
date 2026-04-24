<?php
// --- CONFIGURAÇÃO DE SEGURANÇA E CABEÇALHOS HTTP ---
// Estes cabeçalhos são cruciais para permitir que o Frontend (React) se comunique com o Backend (PHP).
// `Access-Control-Allow-Origin: *` permite requisições de qualquer domínio.
// `Access-Control-Allow-Methods` e `Access-Control-Allow-Headers` definem quais métodos HTTP e cabeçalhos são permitidos.
// `Content-Type: application/json` informa ao navegador que a resposta será em JSON.
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// --- TRATAMENTO DE REQUISIÇÕES OPTIONS (PREFLIGHT) ---
// Navegadores enviam requisições OPTIONS antes de requisições "complexas" (POST, PUT, DELETE) para verificar as permissões do servidor.
// Se a requisição for OPTIONS, o script retorna um status 200 (OK) e encerra, sem processar a lógica principal.
if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
    http_response_code(200);
    exit();
}

// --- CONEXÃO COM O BANCO DE DADOS MySQL ---
// Cria uma nova conexão com o banco de dados `family_hub` usando a classe `mysqli`.
// Os parâmetros são: servidor (localhost), usuário (root), senha (Senai@118) e nome do banco de dados.
// ATENÇÃO: A senha "Senai@118" é um exemplo. Em um ambiente de produção, use senhas fortes e variáveis de ambiente para segurança.
$conn = new mysqli("localhost", "root", "Senai@118", "family_hub");

// --- VERIFICAÇÃO DE ERRO NA CONEXÃO ---
// Se houver um erro ao tentar conectar ao banco de dados, o script define o status HTTP para 500 (Erro Interno do Servidor).
// Uma mensagem de erro em JSON é retornada ao cliente e o script é encerrado.
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Falha na conexão com o banco de dados: " . $conn->connect_error]);
    exit();
}

// --- CONFIGURAÇÃO DE CHARSET ---
// Define o conjunto de caracteres da conexão como `utf8mb4` para garantir o correto manuseio de caracteres especiais e emojis.
$conn->set_charset("utf8mb4");

// Este arquivo (`conexao.php`) é incluído em outros arquivos da API para estabelecer a conexão com o banco de dados de forma centralizada.
?>
