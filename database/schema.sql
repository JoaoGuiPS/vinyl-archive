-- Criar o banco de dados
CREATE DATABASE IF NOT EXISTS vinyl_archive DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE vinyl_archive;

-- Tabela de Artistas
CREATE TABLE IF NOT EXISTS artistas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    biografia TEXT,
    pais_origem VARCHAR(100),
    ano_inicio_atividade INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de Gêneros
CREATE TABLE IF NOT EXISTS generos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de Álbuns
CREATE TABLE IF NOT EXISTS albuns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    artista_id INT NOT NULL,
    genero_id INT,
    ano_lancamento INT NOT NULL,
    gravadora VARCHAR(150),
    pais_lancamento VARCHAR(100),
    descricao TEXT,
    contexto_historico TEXT,
    curiosidades TEXT,
    capa_path VARCHAR(255),
    capa_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (artista_id) REFERENCES artistas(id) ON DELETE RESTRICT,
    FOREIGN KEY (genero_id) REFERENCES generos(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de Músicas
CREATE TABLE IF NOT EXISTS musicas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    album_id INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    numero_faixa INT NOT NULL,
    lado_vinil VARCHAR(10),
    duracao_segundos INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (album_id) REFERENCES albuns(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Inserir Dados de Exemplo (Gêneros)
INSERT INTO generos (nome, descricao) VALUES 
('Traditional Pop', 'Estilo musical popular ocidental que antecede o advento do rock and roll.'),
('Jazz', 'Gênero musical que se originou nas comunidades afro-americanas de Nova Orleans.'),
('Bossa Nova', 'Gênero musical brasileiro derivado do samba e com forte influência do jazz.');

-- Inserir Dados de Exemplo (Artistas)
INSERT INTO artistas (nome, biografia, pais_origem, ano_inicio_atividade) VALUES 
('Frank Sinatra', 'Um dos mais populares e influentes artistas musicais do século XX.', 'Estados Unidos', 1935),
('João Gilberto', 'Violonista e cantor brasileiro, considerado o criador da batida da Bossa Nova.', 'Brasil', 1950);

-- Inserir Dados de Exemplo (Álbuns)
INSERT INTO albuns (titulo, artista_id, genero_id, ano_lancamento, gravadora, pais_lancamento, descricao, contexto_historico, capa_url) VALUES 
('Cycles', 1, 1, 1968, 'Reprise Records', 'Estados Unidos', 'Lançado no final de 1968, traz Sinatra interpretando canções contemporâneas folk-rock.', 'Durante uma época de forte transição musical nos EUA, Sinatra buscou se reconectar com o público jovem.', 'https://upload.wikimedia.org/wikipedia/en/9/90/Frank_Sinatra_Cycles.jpg'),
('Getz/Gilberto', 2, 3, 1964, 'Verve Records', 'Estados Unidos', 'Álbum icônico que popularizou a Bossa Nova internacionalmente.', 'Gravado em Nova York, uniu o saxofonista Stan Getz e o violonista João Gilberto.', 'https://upload.wikimedia.org/wikipedia/en/b/b5/Getz_gilberto.jpg');

-- Inserir Dados de Exemplo (Músicas para o álbum Cycles - ID 1)
INSERT INTO musicas (album_id, titulo, numero_faixa, lado_vinil, duracao_segundos) VALUES 
(1, 'Rain in My Heart', 1, 'A', 200),
(1, 'From Both Sides, Now', 2, 'A', 175),
(1, 'Little Green Apples', 3, 'A', 300),
(1, 'Pretty Colors', 4, 'A', 155),
(1, 'Cycles', 5, 'A', 187),
(1, 'Wandering', 6, 'B', 165),
(1, 'By the Time I Get to Phoenix', 7, 'B', 235),
(1, 'Moody River', 8, 'B', 153),
(1, 'My Way of Life', 9, 'B', 185),
(1, 'Gentle on My Mind', 10, 'B', 201);