/**
 * Lógica da Página de Detalhes do Álbum (album.html)
 */
document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('album-container');
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (!id) {
        container.innerHTML = `
            <div class="empty-state">
                <h2>Álbum não especificado.</h2>
                <a href="catalogo.html" class="btn btn-primary" style="margin-top:1rem;">Voltar ao Catálogo</a>
            </div>`;
        return;
    }

    try {
        const album = await API.getAlbumById(id);
        const capaSrc = getCapaUrl(album);

        // Agrupar faixas por Lado A, Lado B, etc.
        const musicasPorLado = {};
        let duracaoTotalSegundos = 0;

        if (album.musicas && album.musicas.length > 0) {
            album.musicas.forEach(musica => {
                const lado = musica.lado_vinil || 'A';
                if (!musicasPorLado[lado]) musicasPorLado[lado] = [];
                musicasPorLado[lado].push(musica);
                if (musica.duracao_segundos) duracaoTotalSegundos += parseInt(musica.duracao_segundos);
            });
        }

        let tracklistHtml = '';
        if (Object.keys(musicasPorLado).length === 0) {
            tracklistHtml = '<p>Nenhuma faixa cadastrada para este álbum ainda.</p>';
        } else {
            for (const [lado, faixas] of Object.entries(musicasPorLado)) {
                tracklistHtml += `<h4 class="side-title">Lado ${escapeHtml(lado)}</h4>`;
                faixas.forEach(f => {
                    tracklistHtml += `
                        <div class="track-item">
                            <span><strong>${escapeHtml(f.numero_faixa)}.</strong> ${escapeHtml(f.titulo)}</span>
                            <span>${formatDuration(f.duracao_segundos)}</span>
                        </div>
                    `;
                });
            }
        }

        container.innerHTML = `
            <a href="catalogo.html" class="btn btn-secondary" style="margin-bottom: 2rem;">&larr; Voltar ao Catálogo</a>
            <div class="album-detail-grid">
                <div>
                    <img src="${escapeHtml(capaSrc)}" 
                         alt="Capa de ${escapeHtml(album.titulo)}" 
                         class="album-detail-cover"
                         onerror="this.onerror=null; this.src='assets/images/placeholder-album.svg';">
                </div>
                <div>
                    <div class="album-detail-header">
                        <h1>${escapeHtml(album.titulo)}</h1>
                        <p class="album-detail-artist">${escapeHtml(album.artista_nome || 'Artista Não Informado')}</p>
                    </div>

                    <table class="meta-table">
                        <tr><td class="label">Ano de Lançamento:</td><td>${escapeHtml(album.ano_lancamento)}</td></tr>
                        <tr><td class="label">Gênero:</td><td>${escapeHtml(album.genero_nome || 'Não catalogado')}</td></tr>
                        <tr><td class="label">Gravadora:</td><td>${escapeHtml(album.gravadora || 'Não informada')}</td></tr>
                        <tr><td class="label">Duração Total:</td><td>${formatDuration(duracaoTotalSegundos)}</td></tr>
                    </table>

                    ${album.descricao ? `<h3>Sobre o Álbum</h3><p>${escapeHtml(album.descricao)}</p>` : ''}
                    ${album.contexto_historico ? `<h3 style="margin-top:1rem;">Contexto Histórico</h3><p>${escapeHtml(album.contexto_historico)}</p>` : ''}

                    <div class="tracklist-container">
                        <h3>Alinhamento de Faixas</h3>
                        ${tracklistHtml}
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        container.innerHTML = `
            <div class="empty-state">
                <h2>Álbum não encontrado.</h2>
                <p>O registro solicitado não foi localizado no arquivo.</p>
                <a href="catalogo.html" class="btn btn-primary" style="margin-top:1rem;">Voltar ao Catálogo</a>
            </div>`;
    }
});