/**
 * Vinyl Archive — Funções Utilitárias Globais
 */

// Escape de HTML para prevenção de vulnerabilidades XSS
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Resolução de Caminho da Capa (Upload Local vs URL Externa vs Placeholder)
function getCapaUrl(album) {
    if (album.capa_path) {
        return album.capa_path;
    }
    if (album.capa_url) {
        return album.capa_url;
    }
    return 'assets/images/placeholder-album.svg';
}

// Renderização de Card de Álbum
function renderAlbumCard(album) {
    const capaSrc = getCapaUrl(album);
    return `
        <a href="album.html?id=${album.id}" class="album-card">
            <img src="${escapeHtml(capaSrc)}" 
                 alt="Capa de ${escapeHtml(album.titulo)}" 
                 class="album-card-cover"
                 onerror="this.onerror=null; this.src='assets/images/placeholder-album.svg';">
            <div class="album-card-info">
                <h3 class="album-card-title">${escapeHtml(album.titulo)}</h3>
                <p class="album-card-artist">${escapeHtml(album.artista_nome || 'Artista Desconhecido')}</p>
                <div class="album-card-meta">
                    <span>${escapeHtml(album.genero_nome || 'Gênero não informado')}</span>
                    <span>${escapeHtml(album.ano_lancamento)}</span>
                </div>
            </div>
        </a>
    `;
}

// Formatação de Segundos em MM:SS
function formatDuration(segundos) {
    if (!segundos) return '--:--';
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Sistema de Notificações Toast
function showToast(mensagem, tipo = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast-notification ${tipo}`;
    toast.innerText = mensagem;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}