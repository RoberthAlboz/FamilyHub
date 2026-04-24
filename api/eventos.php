<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once 'conexao.php';
$method = $_SERVER['REQUEST_METHOD'];

// BUSCAR EVENTOS (GET)
if ($method === 'GET') {
    $membro_id = isset($_GET['membro_id']) ? intval($_GET['membro_id']) : 0;
    
    $sql = "SELECT * FROM eventos WHERE membro_id = $membro_id";
    $result = $conn->query($sql);
    $eventos = [];
    
    if ($result && $result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $eventos[] = [
                "id" => $row['id'],
                "titulo" => $row['titulo'],
                "data" => $row['data_evento'], // Nome igual ao React
                "categoria" => $row['categoria'],
                "icone" => $row['icone']
            ];
        }
    }
    echo json_encode($eventos);
}

// CRIAR NOVO EVENTO (POST)
elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    if(!empty($data->titulo) && !empty($data->data) && !empty($data->membro_id)) {
        $titulo = $conn->real_escape_string($data->titulo);
        $data_evento = $conn->real_escape_string($data->data);
        $categoria = $conn->real_escape_string($data->categoria);
        $icone = $conn->real_escape_string($data->icone);
        $membro_id = intval($data->membro_id);
        
        $sql = "INSERT INTO eventos (membro_id, titulo, data_evento, categoria, icone) VALUES ($membro_id, '$titulo', '$data_evento', '$categoria', '$icone')";
        if($conn->query($sql) === TRUE) {
            echo json_encode(["success" => true, "id" => $conn->insert_id]);
        } else {
            echo json_encode(["success" => false, "error" => $conn->error]);
        }
    }
}

// DELETAR EVENTO (DELETE)
elseif ($method === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"));
    if(!empty($data->id)) {
        $id = intval($data->id);
        $sql = "DELETE FROM eventos WHERE id = $id";
        if($conn->query($sql) === TRUE) {
            echo json_encode(["success" => true]);
        }
    }
}
?>