<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = new mysqli("localhost", "root", "Senai@118", "family_hub");

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Falha na conexão"]);
    exit();
}

$conn->set_charset("utf8mb4");
?>