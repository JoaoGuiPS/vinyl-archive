<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once 'config/database.php';
$pdo = getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query("SELECT id, nome FROM generos ORDER BY nome ASC");
    echo json_encode($stmt->fetchAll());
}
?>