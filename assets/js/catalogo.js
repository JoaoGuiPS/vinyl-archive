/**
 * Lógica da Página de Catálogo (catalogo.html)
 */
document.addEventListener('DOMContentLoaded', async () => {
    const filterForm = document.getElementById('filter-form');
    const searchInput = document.getElementById('search-input');
    const generoSelect = document.getElementById('genero-select');
    const orderSelect = document.getElementById('order-select');
    const catalogoGrid = document.getElementById('catalogo-grid');
    const resetBtn = document.getElementById('btn-reset-filters');

    // Ler parâmetros passados na URL (ex: ?busca=Frank ou ?genero_id=2)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('busca')) searchInput.value = urlParams.get('busca');

    // Carregar opções de gêneros no filtro
    try {
        const generos = await API.getGeneros();
        generoSelect.innerHTML = '<option value="">Todos os Gêneros</option>' + 
            generos.map(g => `<option value="${g.id}">${escapeHtml(g.nome)}</option>`).join('');
            
        if (urlParams.has('genero_id')) {
            generoSelect.value = urlParams.get('genero_id');
        }
    } catch (e) {
        console.error('Erro ao carregar gêneros para o filtro.');
    }

    // Função de Busca e Renderização
    async function loadCatalog() {
        catalogoGrid.innerHTML = '<div class="loading-state"><p>Carregando acervo...</p></div>';
        
        const params = {};
        if (searchInput.value.trim()) params.busca = searchInput.value.trim();
        if (generoSelect.value) params.genero_id = generoSelect.value;

        try {
            let albuns = await API.getAlbuns(params);

            // Ordenação local após retorno da API
            const orderOption = orderSelect.value;
            if (orderOption === 'ano_desc') albuns.sort((a, b) => b.ano_lancamento - a.ano_lancamento);
            if (orderOption === 'ano_asc') albuns.sort((a, b) => a.ano_lancamento - b.ano_lancamento);
            if (orderOption === 'titulo_asc') albuns.sort((a, b) => a.titulo.localeCompare(b.titulo));

            if (albuns.length === 0) {
                catalogoGrid.innerHTML = '<div class="empty-state"><p>Nenhum álbum encontrado com os critérios selecionados.</p></div>';
                return;
            }

            catalogoGrid.innerHTML = albuns.map(renderAlbumCard).join('');
        } catch (error) {
            catalogoGrid.innerHTML = '<div class="empty-state"><p>Erro ao conectar com a API do arquivo.</p></div>';
        }
    }

    filterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        loadCatalog();
    });

    resetBtn.addEventListener('click', () => {
        searchInput.value = '';
        generoSelect.value = '';
        orderSelect.value = 'recentes';
        loadCatalog();
    });

    loadCatalog();
});