/**
 * Lógica da Listagem e Perfil de Artistas (artistas.html e artista.html)
 */
document.addEventListener('DOMContentLoaded', async () => {
    const artistasGrid = document.getElementById('artistas-grid');
    const artistaContainer = document.getElementById('artista-container');

    // Lógica para a Página da Lista de Artistas (artistas.html)
    if (artistasGrid) {
        try {
            const artistas = await API.getArtistas();
            if (artistas.length === 0) {
                artistasGrid.innerHTML = '<div class="empty-state"><p>Nenhum artista cadastrado.</p></div>';
                return;
            }

            artistasGrid.innerHTML = artistas.map(a => `
                <div class="album-card" style="padding: 1.5rem;">
                    <h3 class="album-card-title">${escapeHtml(a.nome)}</h3>
                    <p style="font-size: 0.9rem; color: #6A5F58;">${escapeHtml(a.pais_origem || 'País não informado')}</p>
                    <a href="artista.html?id=${a.id}" class="btn btn-secondary btn-sm" style="margin-top:1rem;">Ver Perfil e Álbuns</a>
                </div>
            `).join('');
        } catch (e) {
            artistasGrid.innerHTML = '<div class="empty-state"><p>Erro ao carregar artistas.</p></div>';
        }
    }

    // Lógica para a Página de Perfil Único (artista.html)
    if (artistaContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        if (!id) {
            artistaContainer.innerHTML = '<p>Artista não especificado.</p>';
            return;
        }

        try {
            const artistas = await API.getArtistas();
            const artista = artistas.find(a => a.id == id);

            if (!artista) {
                artistaContainer.innerHTML = '<p>Artista não encontrado.</p>';
                return;
            }

            // Buscar álbuns deste artista especificamente
            const todosAlbuns = await API.getAlbuns();
            const albunsDoArtista = todosAlbuns.filter(alb => alb.artista_nome === artista.nome);

            artistaContainer.innerHTML = `
                <a href="artistas.html" class="btn btn-secondary" style="margin-bottom:2rem;">&larr; Voltar para Artistas</a>
                <h1 style="font-family: var(--font-heading); font-size: 2.5rem;">${escapeHtml(artista.nome)}</h1>
                <p><strong>Origem:</strong> ${escapeHtml(artista.pais_origem || 'Não informada')}</p>
                <p style="margin-top:1rem;">${escapeHtml(artista.biografia || 'Sem biografia cadastrada.')}</p>

                <h2 style="font-family: var(--font-heading); margin-top:3rem; margin-bottom:1.5rem;">Álbuns do Artista no Acervo</h2>
                <div class="album-grid">
                    ${albunsDoArtista.length > 0 ? albunsDoArtista.map(renderAlbumCard).join('') : '<p>Nenhum álbum cadastrado para este artista.</p>'}
                </div>
            `;
        } catch (e) {
            artistaContainer.innerHTML = '<p>Erro ao carregar dados do artista.</p>';
        }
    }
});