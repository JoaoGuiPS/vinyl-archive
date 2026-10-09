/**
 * Vinyl Archive — Cliente de Comunicação com a API REST PHP
 */
const API_BASE_URL = 'api';

const API = {
    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);
            const contentType = response.headers.get('content-type');

            if (!response.ok) {
                let errorMessage = `Erro na requisição (${response.status})`;
                if (contentType && contentType.includes('application/json')) {
                    const errorJson = await response.json();
                    errorMessage = errorJson.erro || errorMessage;
                }
                throw new Error(errorMessage);
            }

            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            return await response.text();
        } catch (error) {
            console.error(`[API Error]: ${error.message}`);
            throw error;
        }
    },

    // --- ÁLBUNS ---
    getAlbuns(params = {}) {
        const query = new URLSearchParams(params).toString();
        return this.request(`albuns.php${query ? '?' + query : ''}`);
    },

    getAlbumById(id) {
        return this.request(`albuns.php?id=${id}`);
    },

    saveAlbum(formData) {
        // Envia FormData via POST (para suporte a upload de arquivos)
        return this.request('albuns.php', {
            method: 'POST',
            body: formData
        });
    },

    deleteAlbum(id) {
        return this.request(`albuns.php?id=${id}`, {
            method: 'DELETE'
        });
    },

    // --- ARTISTAS ---
    getArtistas() {
        return this.request('artistas.php');
    },

    saveArtista(artistaData) {
        return this.request('artistas.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(artistaData)
        });
    },

    // --- MÚSICAS ---
    getMusicasByAlbum(albumId) {
        return this.request(`musicas.php?album_id=${albumId}`);
    },

    saveMusica(musicaData) {
        return this.request('musicas.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(musicaData)
        });
    },

    deleteMusica(id) {
        return this.request(`musicas.php?id=${id}`, {
            method: 'DELETE'
        });
    },

    // --- GÊNEROS ---
    getGeneros() {
        return this.request('generos.php');
    }
};