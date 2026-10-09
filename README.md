# Vinyl Archive — Enciclopédia Digital de Discos de Vinil

O **Vinyl Archive** é um sistema web completo desenvolvido como uma enciclopédia digital e biblioteca histórica dedicada à catalogação de discos de vinil, álbuns musicais, artistas, faixas e contextos históricos de gravação.

O projeto **não é uma loja virtual** e não possui carrinho ou finalidades comerciais. Seu propósito central é organizar, catalogar e apresentar dados fonográficos de forma intuitiva, elegante e responsiva.

---

## 🎨 Identidade Visual e Inspiração

A interface do Vinyl Archive foi inspirada na atmosfera estética e editorial da capa do álbum ***Cycles*** (Frank Sinatra, 1968). A direção artística combina o charme dos catálogos de arquivo da década de 1960 com a usabilidade moderna.

* **Creme e Marfim (`#FDFBF7` / `#F5F2EB`):** Fundos e superfícies principais.
* **Bege Envelhecido (`#E8E2CE`):** Painéis e áreas secundárias.
* **Marrom Escuro (`#3A2E2B`):** Leitura de textos e alto contraste.
* **Verde-Oliva (`#556B2F`):** Destaques, botões e navegação.
* **Preto Suave (`#1A1817`):** Títulos editoriais.
* **Dourado Envelhecido (`#C5A059`):** Detalhes decorativos e divisores.

---

## 🚀 Funcionalidades

* **Página Inicial:** Apresentação da biblioteca, pesquisa rápida, destaques do acervo e navegação por gêneros.
* **Catálogo de Álbuns:** Grade responsiva com filtro em tempo real por título, artista e gênero, além de ordenação por ano ou título.
* **Página de Detalhes do Álbum:** Informações detalhadas sobre gravadora, contexto histórico, descrição, duração total e alinhamento de faixas divididas por Lado A e Lado B.
* **Artistas:** Listagem de artistas catalogados e página de perfil com biografia e discografia vinculada.
* **Painel Administrativo (CRUD):**
* Cadastro, edição e exclusão de álbuns.
* Cadastro e consulta de artistas.
* Vinculação de faixas (músicas) com tempo de duração e posicionamento de lado do vinil.


* **Gerenciamento Flexível de Capas:**
* **Opção A:** Upload de arquivos de imagem locais (JPEG, PNG, WebP) com validação de tipo/tamanho no servidor.
* **Opção B:** Inserção via URL externa com visualização prévia em tempo real.



---

## 🛠️ Tecnologias Utilizadas

### Front-end

* **HTML5:** Estruturação semântica e acessível.
* **CSS3:** Estilização customizada com CSS Variables, Flexbox, Grid e fontes editoriais (*Playfair Display* e *Source Sans 3*).
* **JavaScript (Vanilla JS):** Lógica dinâmica de interface e manipulação da DOM sem dependência de frameworks.
* **Fetch API:** Comunicação assíncrona com os endpoints da API REST.

### Back-end

* **PHP 8.x:** API RESTful desenvolvida em PHP puro.
* **PDO (PHP Data Objects):** Conexão segura ao banco de dados com uso estrito de *Prepared Statements* contra SQL Injection.
* **Arquitetura JSON:** Todas as respostas da API são estruturadas em formato `application/json`.

### Banco de Dados

* **MariaDB / MySQL:** Banco relacional estruturado com chaves estrangeiras (`FOREIGN KEY`), integridade referencial e índices de busca.

---

## 📂 Estrutura de Pastas e Arquivos

```text
vinyl-archive/
├── index.html                   # Página Inicial
├── catalogo.html                # Catálogo com filtros
├── album.html                   # Detalhes do álbum e faixas
├── artistas.html                # Lista de artistas
├── artista.html                 # Perfil do artista e discografia
├── admin.html                   # Painel administrativo (CRUD)
│
├── assets/
│   ├── css/
│   │   └── style.css            # Estilos globais e componentes
│   ├── js/
│   │   ├── api.js               # Cliente Fetch para consumo da API
│   │   ├── main.js              # Utilitários e renderização global
│   │   ├── catalogo.js          # Lógica de filtros e ordenação
│   │   ├── album.js             # Renderização de faixas e metadados
│   │   ├── artistas.js          # Gestão das páginas de artistas
│   │   └── admin.js             # Lógica do painel de controle
│   └── images/
│       ├── logo.svg              # Logotipo do projeto
│       └── placeholder-album.svg # Capa genérica fallback
│
├── api/
│   ├── config/
│   │   └── database.php         # Conexão PDO com MariaDB
│   ├── albuns.php               # Endpoint de gestão de álbuns
│   ├── artistas.php             # Endpoint de gestão de artistas
│   ├── generos.php              # Endpoint de listagem de gêneros
│   └── musicas.php              # Endpoint de faixas por álbum
│
├── uploads/
│   └── album_covers/            # Diretório de armazenamento de capas salvas
│
└── database/
    └── schema.sql               # Script DDL/DML de criação do banco

```

---

## ⚙️ Pré-requisitos e Instalação

Para executar o projeto localmente, é necessário ter o ambiente **XAMPP** (ou similar) configurado com **Apache** e **MySQL/MariaDB**.

### 1. Clonar ou Copiar os Arquivos

Mova ou clone a pasta do projeto para o diretório `htdocs` do seu XAMPP:

```text
C:\xampp\htdocs\vinyl-archive\

```

### 2. Iniciar os Serviços

Abra o **XAMPP Control Panel** e inicie os módulos:

* **Apache**
* **MySQL**

### 3. Configurar o Banco de Dados

1. Acesse o phpMyAdmin no navegador: `http://localhost/phpmyadmin/`
2. Clique na aba **SQL**.
3. Copie todo o conteúdo do arquivo `database/schema.sql` e cole no campo de texto.
4. Execute o script. O banco de dados `vinyl_archive` será criado com tabelas e dados de demonstração (incluindo o álbum *Cycles* de Frank Sinatra e *Getz/Gilberto*).

### 4. Ajustar Conexão do Banco (Se necessário)

Caso seu MySQL do XAMPP utilize senha, abra o arquivo `api/config/database.php` e insira as credenciais corretas:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'vinyl_archive');
define('DB_USER', 'root');
define('DB_PASS', ''); // Insira a senha aqui se houver

```

### 5. Acessar a Aplicação

Abra o navegador e acesse:

```text
http://localhost/vinyl-archive/

```

> **Atenção:** Sempre acesse o projeto via servidor local (`http://localhost/...`). **Não** abra os arquivos HTML diretamente clicando duas vezes (`file:///...`), pois o navegador bloqueará as requisições `fetch()` por política de segurança.

---

## 📡 Endpoints da API REST

| Recurso | Método HTTP | Endpoint | Descrição |
| --- | --- | --- | --- |
| **Álbuns** | `GET` | `/api/albuns.php` | Listagem geral com suporte a `?busca=` e `?genero_id=` |
|  | `GET` | `/api/albuns.php?id={id}` | Detalhes completos de um álbum e suas faixas |
|  | `POST` | `/api/albuns.php` | Cadastro de novo álbum (aceita `multipart/form-data`) |
|  | `POST` | `/api/albuns.php` + `_method=PUT` | Atualização de registro de álbum existente |
|  | `DELETE` | `/api/albuns.php?id={id}` | Remoção de um álbum e sua capa local |
| **Artistas** | `GET` | `/api/artistas.php` | Listagem de todos os artistas cadastrados |
|  | `POST` | `/api/artistas.php` | Cadastro de novo artista (`application/json`) |
| **Gêneros** | `GET` | `/api/generos.php` | Listagem dos gêneros musicais disponíveis |
| **Músicas** | `GET` | `/api/musicas.php?album_id={id}` | Listagem de faixas vinculadas a um álbum |
|  | `POST` | `/api/musicas.php` | Cadastro de nova faixa associada a um álbum |
|  | `DELETE` | `/api/musicas.php?id={id}` | Exclusão de faixa individual |

---

## 📜 Licença e Observações

Projeto desenvolvido estritamente para fins acadêmicos e educacionais. Isento de direitos comerciais ou reprodução de áudio protegida por copyright.