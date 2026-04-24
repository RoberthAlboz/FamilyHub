<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once 'conexao.php';

function response($success, $data = null, $error = null) {
    echo json_encode([
        "success" => $success,
        "data" => $data,
        "error" => $error
    ]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    response(false, null, "Método não permitido. Use POST.");
}

$input = json_decode(file_get_contents("php://input"));

if (!$input) {
    response(false, null, "JSON inválido.");
}

if (empty($input->nome) || empty($input->email) || empty($input->senha)) {
    response(false, null, "Preencha todos os campos.");
}

$nome = trim($input->nome);
$email = trim($input->email);
$senha = $input->senha;

// Validação básica
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    response(false, null, "E-mail inválido.");
}

if (strlen($senha) < 6) {
    response(false, null, "A senha deve ter pelo menos 6 caracteres.");
}

// Verifica se já existe
$stmt = $conn->prepare("SELECT id FROM membros WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    response(false, null, "E-mail já cadastrado.");
}

$senha_hash = password_hash($senha, PASSWORD_DEFAULT);

// Inserção segura
$stmt = $conn->prepare("INSERT INTO membros (nome, email, senha, xp) VALUES (?, ?, ?, 0)");
$stmt->bind_param("sss", $nome, $email, $senha_hash);

if ($stmt->execute()) {
    response(true, ["message" => "Conta criada com sucesso!"]);
} else {
    response(false, null, "Erro ao criar conta.");
}
?>