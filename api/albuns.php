<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");

require_once 'config/database.php';
$pdo = getConnection();
$method = $_SERVER['REQUEST_METHOD'];

// Lidar com requisições OPTIONS (CORS preflight)
if ($method === 'OPTIONS') { http_response_code(200); exit; }

if ($method === 'GET') {
    $id = isset($_GET['id']) ? intval($_GET['id']) : null;

    if ($id) {
        // Busca álbum específico com detalhes do artista e gênero
        $stmt = $pdo->prepare("
            SELECT a.*, art.nome as artista_nome, g.nome as genero_nome 
            FROM albuns a 
            LEFT JOIN artistas art ON a.artista_id = art.id 
            LEFT JOIN generos g ON a.genero_id = g.id 
            WHERE a.id = ?
        ");
        $stmt->execute([$id]);
        $album = $stmt->fetch();

        if ($album) {
            // Busca as músicas do álbum
            $stmtMusicas = $pdo->prepare("SELECT * FROM musicas WHERE album_id = ? ORDER BY lado_vinil ASC, numero_faixa ASC");
            $stmtMusicas->execute([$id]);
            $album['musicas'] = $stmtMusicas->fetchAll();
            echo json_encode($album);
        } else {
            http_response_code(404);
            echo json_encode(['erro' => 'Álbum não encontrado.']);
        }
    } else {
        // Busca todos com filtros (Busca por título/artista, filtro por gênero)
        $busca = isset($_GET['busca']) ? '%' . $_GET['busca'] . '%' : '%';
        $genero_id = isset($_GET['genero_id']) && $_GET['genero_id'] !== '' ? intval($_GET['genero_id']) : null;
        
        $sql = "
            SELECT a.id, a.titulo, a.ano_lancamento, a.capa_path, a.capa_url, 
                   art.nome as artista_nome, g.nome as genero_nome 
            FROM albuns a 
            LEFT JOIN artistas art ON a.artista_id = art.id 
            LEFT JOIN generos g ON a.genero_id = g.id 
            WHERE (a.titulo LIKE :busca_titulo OR art.nome LIKE :busca_artista)
        ";
        
        if ($genero_id) { $sql .= " AND a.genero_id = :genero_id"; }
        $sql .= " ORDER BY a.ano_lancamento DESC";

        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':busca_titulo', $busca);
        $stmt->bindParam(':busca_artista', $busca);
        if ($genero_id) { $stmt->bindParam(':genero_id', $genero_id); }
        $stmt->execute();
        
        echo json_encode($stmt->fetchAll());
    }
} 
elseif ($method === 'POST') {
    // POST para Criação (ou Atualização se _method=PUT for enviado)
    $isUpdate = isset($_POST['_method']) && $_POST['_method'] === 'PUT';
    $id = isset($_POST['id']) ? intval($_POST['id']) : null;

    $titulo = $_POST['titulo'] ?? '';
    $artista_id = $_POST['artista_id'] ?? null;
    $genero_id = !empty($_POST['genero_id']) ? $_POST['genero_id'] : null;
    $ano_lancamento = !empty($_POST['ano_lancamento']) ? $_POST['ano_lancamento'] : null;
    $gravadora = $_POST['gravadora'] ?? null;
    $descricao = $_POST['descricao'] ?? null;
    $capa_url = !empty($_POST['capa_url']) ? $_POST['capa_url'] : null;
    $capa_path = null;

    if (empty($titulo) || empty($artista_id) || empty($ano_lancamento)) {
        http_response_code(400);
        echo json_encode(['erro' => 'Título, artista e ano são obrigatórios.']);
        exit;
    }

    // Processamento de Upload de Imagem (Opção A)
    if (isset($_FILES['capa_file']) && $_FILES['capa_file']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = '../uploads/album_covers/';
        if (!is_dir($uploadDir)) { mkdir($uploadDir, 0755, true); }
        
        $fileInfo = pathinfo($_FILES['capa_file']['name']);
        $ext = strtolower($fileInfo['extension']);
        $allowedExts = ['jpg', 'jpeg', 'png', 'webp'];
        
        if (in_array($ext, $allowedExts) && $_FILES['capa_file']['size'] <= 5000000) {
            // Gera nome único seguro
            $newFileName = uniqid('capa_') . '.' . $ext;
            $destPath = $uploadDir . $newFileName;
            
            if (move_uploaded_file($_FILES['capa_file']['tmp_name'], $destPath)) {
                $capa_path = 'uploads/album_covers/' . $newFileName;
                $capa_url = null; // Prioriza o upload local se ambos forem enviados
            }
        }
    }

    if ($isUpdate && $id) {
        // Lógica de update simplificada para brevidade.
        $sql = "UPDATE albuns SET titulo=?, artista_id=?, genero_id=?, ano_lancamento=?, gravadora=?, descricao=?";
        $params = [$titulo, $artista_id, $genero_id, $ano_lancamento, $gravadora, $descricao];
        
        if ($capa_path) {
            $sql .= ", capa_path=?, capa_url=NULL";
            $params[] = $capa_path;
        } elseif ($capa_url) {
            $sql .= ", capa_url=?, capa_path=NULL";
            $params[] = $capa_url;
        }
        
        $sql .= " WHERE id=?";
        $params[] = $id;
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        echo json_encode(['mensagem' => 'Álbum atualizado com sucesso.']);
    } else {
        // Criar novo
        $sql = "INSERT INTO albuns (titulo, artista_id, genero_id, ano_lancamento, gravadora, descricao, capa_path, capa_url) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$titulo, $artista_id, $genero_id, $ano_lancamento, $gravadora, $descricao, $capa_path, $capa_url]);
        echo json_encode(['mensagem' => 'Álbum cadastrado com sucesso!', 'id' => $pdo->lastInsertId()]);
    }
}
elseif ($method === 'DELETE') {
    $id = isset($_GET['id']) ? intval($_GET['id']) : null;
    if ($id) {
        // Verifica se há imagem local para deletar (opcional, boa prática)
        $stmt = $pdo->prepare("SELECT capa_path FROM albuns WHERE id = ?");
        $stmt->execute([$id]);
        $album = $stmt->fetch();
        if ($album && $album['capa_path'] && file_exists('../' . $album['capa_path'])) {
            unlink('../' . $album['capa_path']);
        }

        $stmt = $pdo->prepare("DELETE FROM albuns WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['mensagem' => 'Álbum excluído com sucesso.']);
    }
}
?>