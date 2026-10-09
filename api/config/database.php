<?php
// Configurações do Banco de Dados
define('DB_HOST', 'localhost');
define('DB_PORT', 3307);
define('DB_NAME', 'vinyl_archive');
define('DB_USER', 'root');
define('DB_PASS', ''); // Senha padrão do XAMPP é vazia
    
function getConnection() {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false, // Previne injeção ao forçar prepared statements nativos
        ];
        return new PDO($dsn, DB_USER, DB_PASS, $options);
    } catch (PDOException $e) {
        // Retorna erro JSON limpo sem expor credenciais
        header('Content-Type: application/json');
        http_response_code(500);
        echo json_encode(['erro' => 'Falha na conexão com o banco de dados.']);
        exit;
    }
}
?>