<?php
// --- CONFIGURAÇÃO DE SEGURANÇA E CABEÇALHOS HTTP ---
// Assim como em `conexao.php`, estes cabeçalhos são essenciais para permitir a comunicação segura entre o Frontend (React) e esta API PHP.
// Eles controlam quais domínios podem acessar a API, quais métodos HTTP são permitidos e o formato da resposta (JSON).
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// --- INCLUSÃO DA CONEXÃO COM O BANCO DE DADOS ---
// Inclui o arquivo `conexao.php`, que estabelece a conexão com o banco de dados MySQL.
// A variável `$conn` (objeto de conexão) fica disponível para uso neste script.
include_once 'conexao.php';

// --- PROCESSAMENTO DA REQUISIÇÃO HTTP ---
// `$method` armazena o tipo de requisição HTTP (GET, POST, etc.).
// `$data` decodifica o corpo da requisição JSON enviado pelo Frontend, tornando os dados acessíveis como um objeto PHP.
$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"));

// --- LÓGICA PARA REQUISIÇÕES GET (LISTAR TAREFAS) ---
// Se a requisição for GET, o objetivo é buscar todas as tarefas do banco de dados.
// Uma consulta SQL seleciona as tarefas e junta com o nome do responsável (da tabela `membros`).
// Para cada tarefa, são buscados também os comentários associados.
// O resultado final é um array de tarefas, cada uma contendo seus detalhes e comentários, que é então retornado como JSON.
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

// --- LÓGICA PARA REQUISIÇÕES POST (CRIAR, ATUALIZAR, DELETAR TAREFAS/COMENTÁRIOS) ---
// Se a requisição for POST, o script verifica a `$data->acao` para determinar qual operação realizar.
elseif ($method === 'POST') {
    // Validação básica para garantir que o JSON foi recebido corretamente.
    if (!$data) {
        echo json_encode(["success" => false, "error" => "JSON inválido"]);
        exit();
    }

    // --- SUB-LÓGICA BASEADA NA AÇÃO ESPECÍFICA ---
    if (isset($data->acao)) {

        // AÇÃO: CONCLUIR/MUDAR STATUS DA TAREFA
        // Atualiza o status de uma tarefa e ajusta os pontos de experiência (XP) do membro responsável.
        // O XP varia conforme a prioridade da tarefa (Alta, Média, Baixa).
        // Se a tarefa for marcada como concluída, XP é adicionado; se for revertida para pendente, XP é subtraído (sem ficar negativo).
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

            $valor_xp = 10;
            if ($prioridade === 'Alta') $valor_xp = 30;
            elseif ($prioridade === 'Média') $valor_xp = 20;

            if ($novo_status === 'concluida' && $status_atual !== 'concluida') {
                $conn->query("UPDATE membros SET xp = xp + $valor_xp WHERE id = $membro_id");
            } 
            elseif ($novo_status === 'pendente' && $status_atual === 'concluida') {
                $conn->query("UPDATE membros SET xp = GREATEST(0, xp - $valor_xp) WHERE id = $membro_id");
            }
            echo json_encode(["success" => true, "xp_aplicado" => $valor_xp]);
        }

        // AÇÃO: COMENTAR TAREFA
        // Insere um novo comentário associado a uma tarefa específica no banco de dados.
        elseif ($data->acao === 'comentar') {
            $tarefa_id = (int)$data->tarefa_id;
            $texto = $conn->real_escape_string($data->texto);
            $conn->query("INSERT INTO comentarios (tarefa_id, texto, autor) 
                          VALUES ($tarefa_id, '$texto', 'Você')");
            echo json_encode(["success" => true]);
        }

        // AÇÃO: DELETAR TAREFA
        // Remove uma tarefa do banco de dados com base no seu ID.
        elseif ($data->acao === 'deletar') {
            $id = (int)$data->id;
            $conn->query("DELETE FROM tarefas WHERE id = $id");
            echo json_encode(["success" => true]);
        }

    } else {
        // AÇÃO PADRÃO: CRIAR NOVA TAREFA
        // Se nenhuma ação específica for fornecida, a requisição POST é tratada como uma criação de nova tarefa.
        // Os dados da tarefa (título, prioridade, responsável, categoria, data de fim) são extraídos do JSON e inseridos no banco de dados.
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
