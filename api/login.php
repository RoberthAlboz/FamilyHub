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

if (empty($input->email) || empty($input->senha)) {
    response(false, null, "Preencha e-mail e senha.");
}

$email = $input->email;

// Prepared statement
$stmt = $conn->prepare("SELECT id, nome, email, senha, xp FROM membros WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {
    response(false, null, "E-mail não encontrado.");
}

$user = $result->fetch_assoc();

if (!password_verify($input->senha, $user['senha'])) {
    response(false, null, "Senha incorreta.");
}

unset($user['senha']);

response(true, $user);
?>