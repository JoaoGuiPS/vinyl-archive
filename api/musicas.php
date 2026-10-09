<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

require_once 'config/database.php';
$pdo = getConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($method === 'GET') {
    $album_id = isset($_GET['album_id']) ? intval($_GET['album_id']) : null;
    $id = isset($_GET['id']) ? intval($_GET['id']) : null;

    if ($id) {
        $stmt = $pdo->prepare("SELECT * FROM musicas WHERE id = ?");
        $stmt->execute([$id]);
        $musica = $stmt->fetch();
        if ($musica) {
            echo json_encode($musica);
        } else {
            http_response_code(404);
            echo json_encode(['erro' => 'Música não encontrada.']);
        }
    } elseif ($album_id) {
        $stmt = $pdo->prepare("SELECT * FROM musicas WHERE album_id = ? ORDER BY lado_vinil ASC, numero_faixa ASC");
        $stmt->execute([$album_id]);
        echo json_encode($stmt->fetchAll());
    } else {
        http_response_code(400);
        echo json_encode(['erro' => 'Parâmetro album_id ou id é obrigatório.']);
    }
} 
elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        $input = $_POST;
    }

    $album_id = isset($input['album_id']) ? intval($input['album_id']) : null;
    $titulo = isset($input['titulo']) ? trim($input['titulo']) : '';
    $numero_faixa = isset($input['numero_faixa']) ? intval($input['numero_faixa']) : 1;
    $lado_vinil = isset($input['lado_vinil']) ? trim($input['lado_vinil']) : 'A';
    $duracao_segundos = !empty($input['duracao_segundos']) ? intval($input['duracao_segundos']) : null;

    if (!$album_id || empty($titulo)) {
        http_response_code(400);
        echo json_encode(['erro' => 'O ID do álbum e o título da música são obrigatórios.']);
        exit;
    }

    $stmt = $pdo->prepare("
        INSERT INTO musicas (album_id, titulo, numero_faixa, lado_vinil, duracao_segundos) 
        VALUES (?, ?, ?, ?, ?)
    ");
    $stmt->execute([$album_id, $titulo, $numero_faixa, $lado_vinil, $duracao_segundos]);

    http_response_code(201);
    echo json_encode(['mensagem' => 'Música cadastrada com sucesso!', 'id' => $pdo->lastInsertId()]);
}
elseif ($method === 'PUT') {
    $id = isset($_GET['id']) ? intval($_GET['id']) : null;
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$id) {
        http_response_code(400);
        echo json_encode(['erro' => 'ID da música não informado.']);
        exit;
    }

    $titulo = isset($input['titulo']) ? trim($input['titulo']) : '';
    $numero_faixa = isset($input['numero_faixa']) ? intval($input['numero_faixa']) : null;
    $lado_vinil = isset($input['lado_vinil']) ? trim($input['lado_vinil']) : null;
    $duracao_segundos = array_key_exists('duracao_segundos', $input) && $input['duracao_segundos'] !== '' ? intval($input['duracao_segundos']) : null;

    if (empty($titulo)) {
        http_response_code(400);
        echo json_encode(['erro' => 'O título da música é obrigatório.']);
        exit;
    }

    $stmt = $pdo->prepare("
        UPDATE musicas 
        SET titulo = ?, numero_faixa = ?, lado_vinil = ?, duracao_segundos = ? 
        WHERE id = ?
    ");
    $stmt->execute([$titulo, $numero_faixa, $lado_vinil, $duracao_segundos, $id]);

    echo json_encode(['mensagem' => 'Música atualizada com sucesso.']);
}
elseif ($method === 'DELETE') {
    $id = isset($_GET['id']) ? intval($_GET['id']) : null;

    if (!$id) {
        http_response_code(400);
        echo json_encode(['erro' => 'ID da música não informado.']);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM musicas WHERE id = ?");
    $stmt->execute([$id]);

    echo json_encode(['mensagem' => 'Música excluída com sucesso.']);
}
?>