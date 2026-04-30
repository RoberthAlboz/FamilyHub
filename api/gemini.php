<?php
// --- CONFIGURAÇÃO DE CABEÇALHOS ---
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
    http_response_code(200);
    exit();
}

include_once("conexao.php");

// --- CONFIGURAÇÃO DA CHAVE DO GEMINI ---
// O usuário deve substituir 'SUA_CHAVE_AQUI' pela chave real do Google Gemini API
$apiKey = "AIzaSyC4uKDhdOaJdrkEr3tRhy-0oMIYj7-EdGw"; 

$data = json_decode(file_get_contents("php://input"));

if (!$data || !isset($data->mensagem)) {
    echo json_encode(["success" => false, "error" => "Mensagem não fornecida"]);
    exit();
}

$userMessage = $data->mensagem;

// --- BUSCAR CONTEXTO DO BANCO DE DADOS ---
// Vamos pegar um resumo do que está acontecendo na casa para a IA saber responder.

// 1. Membros
$membrosRes = $conn->query("SELECT nome, papel, xp FROM membros");
$membros = [];
while($row = $membrosRes->fetch_assoc()) {
    $membros[] = "{$row['nome']} ({$row['papel']}) com {$row['xp']} XP";
}

// 2. Tarefas Pendentes
$tarefasRes = $conn->query("SELECT t.titulo, m.nome as responsavel FROM tarefas t LEFT JOIN membros m ON t.responsavel_id = m.id WHERE t.status = 'pendente' LIMIT 5");
$tarefas = [];
while($row = $tarefasRes->fetch_assoc()) {
    $tarefas[] = "- {$row['titulo']} (Responsável: {$row['responsavel']})";
}

// 3. Finanças (Resumo)
$financasRes = $conn->query("SELECT tipo, SUM(valor) as total FROM transacoes GROUP BY tipo");
$financas = ["receita" => 0, "despesa" => 0];
while($row = $financasRes->fetch_assoc()) {
    $financas[$row['tipo']] = $row['total'];
}

$contexto = "Você é o assistente virtual do FamilyHub, um sistema de gestão familiar. 
Aqui está o estado atual da família:
Membros: " . implode(", ", $membros) . ".
Tarefas pendentes recentes: " . (empty($tarefas) ? "Nenhuma" : implode("; ", $tarefas)) . ".
Resumo financeiro: Receitas R$ " . number_format($financas['receita'], 2, ',', '.') . ", Despesas R$ " . number_format($financas['despesa'], 2, ',', '.') . ".
Responda de forma amigável e prestativa, ajudando na organização da casa.";

// --- CHAMADA PARA A API DO GEMINI ---
$url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" . $apiKey;

$payload = [
    "contents" => [
        [
            "parts" => [
                ["text" => $contexto . "\n\nUsuário: " . $userMessage]
            ]
        ]
    ]
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    echo json_encode([
        "success" => false, 
        "error" => "Erro na API do Gemini", 
        "details" => json_decode($response)
    ]);
} else {
    $result = json_decode($response);
    $aiResponse = $result->candidates[0]->content->parts[0]->text;
    echo json_encode([
        "success" => true,
        "resposta" => $aiResponse
    ]);
}
?>