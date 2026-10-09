<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");

require_once 'config/database.php';
$pdo = getConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT id, nome FROM artistas ORDER BY nome ASC");
    echo json_encode($stmt->fetchAll());
} 
elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!empty($data['nome'])) {
        $stmt = $pdo->prepare("INSERT INTO artistas (nome, biografia, pais_origem) VALUES (?, ?, ?)");
        $stmt->execute([$data['nome'], $data['biografia'] ?? null, $data['pais_origem'] ?? null]);
        echo json_encode(['mensagem' => 'Artista criado com sucesso!', 'id' => $pdo->lastInsertId()]);
    }
}
?>