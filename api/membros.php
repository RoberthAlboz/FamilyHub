<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once 'conexao.php';

$method = $_SERVER['REQUEST_METHOD'];

// GET - LISTAR MEMBROS
if ($method === 'GET') {
    $sql = "SELECT id, nome, xp FROM membros ORDER BY xp DESC";
    $result = $conn->query($sql);

    $membros = [];

    if ($result) {
        while($row = $result->fetch_assoc()) {
            $row['xp'] = (int)$row['xp'];
            $membros[] = $row;
        }
    }

    echo json_encode($membros);
}

// POST - ATUALIZAR XP
elseif ($method === 'POST') {

    $data = json_decode(file_get_contents("php://input"));

    if (!$data) {
        echo json_encode(["success" => false, "error" => "JSON inválido"]);
        exit();
    }

    if (!isset($data->id) || !isset($data->novoXP)) {
        echo json_encode(["success" => false, "error" => "Dados incompletos"]);
        exit();
    }

    $id = (int)$data->id;
    $novoXP = max(0, (int)$data->novoXP); // nunca negativo

    $sql = "UPDATE membros SET xp = $novoXP WHERE id = $id";

    if ($conn->query($sql) === TRUE) {
        echo json_encode([
            "success" => true,
            "xp" => $novoXP
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "error" => "Erro ao atualizar XP"
        ]);
    }
}
?>