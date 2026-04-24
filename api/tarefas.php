<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

include_once 'conexao.php';

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"));

if ($method === 'GET') {
    $sql = "SELECT t.*, m.nome as responsavel_nome 
            FROM tarefas t 
            LEFT JOIN membros m ON t.responsavel_id = m.id 
            ORDER BY t.criado_em DESC";

    $res = $conn->query($sql);
    $tarefas = [];

    while($row = $res->fetch_assoc()) {
        $t_id = (int)$row['id'];

        $c_res = $conn->query("SELECT * FROM comentarios WHERE tarefa_id = $t_id");
        $row['comentarios'] = ($c_res) ? $c_res->fetch_all(MYSQLI_ASSOC) : [];

        $tarefas[] = $row;
    }

    echo json_encode($tarefas);
}

elseif ($method === 'POST') {

    if (!$data) {
        echo json_encode(["success" => false, "error" => "JSON inválido"]);
        exit();
    }

    if (isset($data->acao)) {

        if ($data->acao === 'concluir') {

            $id = (int)$data->id;

            $check = $conn->query("SELECT responsavel_id, prioridade, status FROM tarefas WHERE id = $id");

            if (!$check || $check->num_rows === 0) {
                echo json_encode(["success" => false, "error" => "Tarefa não encontrada"]);
                exit();
            }

            $tarefa = $check->fetch_assoc();

            $membro_id = (int)$tarefa['responsavel_id'];
            $prioridade = $tarefa['prioridade'];
            $status_atual = $tarefa['status'];

            $novo_status = $conn->real_escape_string($data->status);

            $conn->query("UPDATE tarefas SET status = '$novo_status' WHERE id = $id");

            // XP baseado na prioridade
            $valor_xp = 10;
            if ($prioridade === 'Alta') $valor_xp = 30;
            elseif ($prioridade === 'Média') $valor_xp = 20;

            if ($novo_status === 'concluida' && $status_atual !== 'concluida') {
                $conn->query("UPDATE membros SET xp = xp + $valor_xp WHERE id = $membro_id");
            } 
            elseif ($novo_status === 'pendente' && $status_atual === 'concluida') {
                // Evita XP negativo
                $conn->query("UPDATE membros SET xp = GREATEST(0, xp - $valor_xp) WHERE id = $membro_id");
            }

            echo json_encode(["success" => true, "xp_aplicado" => $valor_xp]);
        }

        elseif ($data->acao === 'comentar') {
            $tarefa_id = (int)$data->tarefa_id;
            $texto = $conn->real_escape_string($data->texto);

            $conn->query("INSERT INTO comentarios (tarefa_id, texto, autor) 
                          VALUES ($tarefa_id, '$texto', 'Você')");

            echo json_encode(["success" => true]);
        }

        elseif ($data->acao === 'deletar') {
            $id = (int)$data->id;

            $conn->query("DELETE FROM tarefas WHERE id = $id");

            echo json_encode(["success" => true]);
        }

    } else {
        // CRIAR TAREFA
        $titulo = $conn->real_escape_string($data->titulo);
        $prioridade = $conn->real_escape_string($data->prioridade);
        $resp_id = (int)$data->responsavel_id;
        $categoria = $conn->real_escape_string($data->categoria);

        $data_fim = !empty($data->data_fim) 
            ? "'" . $conn->real_escape_string($data->data_fim) . "'" 
            : "NULL";

        $sql = "INSERT INTO tarefas (titulo, prioridade, responsavel_id, categoria, data_fim, status) 
                VALUES ('$titulo', '$prioridade', $resp_id, '$categoria', $data_fim, 'pendente')";

        $conn->query($sql);

        echo json_encode(["success" => true]);
    }
}
?>