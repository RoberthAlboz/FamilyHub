<?php
// Habilitar exibição de erros para debug (apenas durante o desenvolvimento)
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200 );
    exit();
}

try {
    // Conexão com o banco
    $conn = new mysqli("localhost", "root", "Senai@118", "family_hub");
    if ($conn->connect_error) {
        throw new Exception("Falha na conexão: " . $conn->connect_error);
    }
    $conn->set_charset("utf8mb4");

    if (empty($_POST['id'])) {
        throw new Exception("ID do usuário não informado.");
    }

    $userId = (int)$_POST['id'];

    if (!isset($_FILES['foto']) || $_FILES['foto']['error'] !== UPLOAD_ERR_OK) {
        throw new Exception("Erro no upload do arquivo (Código: " . ($_FILES['foto']['error'] ?? 'Nenhum') . ")");
    }

    $arquivo = $_FILES['foto'];
    $dirUploads = __DIR__ . '/uploads/fotos/';

    // Criar pasta se não existir
    if (!is_dir($dirUploads)) {
        if (!mkdir($dirUploads, 0777, true)) {
            throw new Exception("Não foi possível criar a pasta de uploads.");
        }
    }

    $extensao = strtolower(pathinfo($arquivo['name'], PATHINFO_EXTENSION));
    $nomeArquivo = 'user_' . $userId . '_' . time() . '.' . $extensao;
    $caminhoCompleto = $dirUploads . $nomeArquivo;
    $caminhoRelativo = 'uploads/fotos/' . $nomeArquivo;

    if (move_uploaded_file($arquivo['tmp_name'], $caminhoCompleto)) {
        $stmt = $conn->prepare("UPDATE membros SET foto_perfil = ? WHERE id = ?");
        $stmt->bind_param("si", $caminhoRelativo, $userId);
        $stmt->execute();
        
        echo json_encode([
            "success" => true,
            "foto_perfil" => $caminhoRelativo,
            "message" => "Upload concluído!"
        ]);
    } else {
        throw new Exception("Erro ao mover o arquivo para a pasta final.");
    }

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}
?>
