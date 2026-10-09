/**
 * Painel de Administração e Gestão CRUD (admin.html)
 */
document.addEventListener('DOMContentLoaded', () => {
    // Sistema de Abas
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });

    // --- ELEMENTOS DO FORMULÁRIO DE ÁLBUNS ---
    const albumForm = document.getElementById('album-form');
    const albumFormTitle = document.getElementById('album-form-title');
    const albumIdInput = document.getElementById('album-id');
    const albumArtistaSelect = document.getElementById('album-artista');
    const albumGeneroSelect = document.getElementById('album-genero');
    const albumSubmitBtn = document.getElementById('album-submit-btn');
    const albumCancelBtn = document.getElementById('album-cancel-btn');
    
    // Radios de alternância do tipo de capa
    const capaTipoRadios = document.querySelectorAll('input[name="capa_tipo"]');
    const capaUrlGroup = document.getElementById('capa-url-group');
    const capaFileGroup = document.getElementById('capa-file-group');
    const capaUrlInput = document.getElementById('album-capa-url');
    const capaFileInput = document.getElementById('album-capa-file');
    const imagePreview = document.getElementById('image-preview');

    // Alternar campos de Upload vs URL
    capaTipoRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'url') {
                capaUrlGroup.classList.remove('hidden');
                capaFileGroup.classList.add('hidden');
                capaFileInput.value = '';
            } else {
                capaUrlGroup.classList.add('hidden');
                capaFileGroup.classList.remove('hidden');
                capaUrlInput.value = '';
            }
        });
    });

    // Pré-visualização da imagem
    capaUrlInput.addEventListener('input', () => {
        imagePreview.src = capaUrlInput.value || 'assets/images/placeholder-album.svg';
    });

    capaFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => imagePreview.src = event.target.result;
            reader.readAsDataURL(file);
        }
    });

    // Carregar selects auxiliares e tabelas
    async function initAdmin() {
        await loadSelectOptions();
        await renderAlbunsTable();
        await renderArtistasTable();
    }

    async function loadSelectOptions() {
        try {
            const artistas = await API.getArtistas();
            const generos = await API.getGeneros();

            const artistaOptions = '<option value="">Selecione um artista...</option>' + 
                artistas.map(a => `<option value="${a.id}">${escapeHtml(a.nome)}</option>`).join('');

            albumArtistaSelect.innerHTML = artistaOptions;
            document.getElementById('musica-album-select').innerHTML = '<option value="">Selecione um álbum...</option>';

            albumGeneroSelect.innerHTML = '<option value="">Selecione um gênero...</option>' + 
                generos.map(g => `<option value="${g.id}">${escapeHtml(g.nome)}</option>`).join('');
        } catch (e) {
            showToast('Erro ao carregar selects de apoio.', 'error');
        }
    }

    async function renderAlbunsTable() {
        const tbody = document.getElementById('table-albuns-body');
        try {
            const albuns = await API.getAlbuns();
            
            // Atualiza select de álbuns na aba de músicas
            const musicaAlbumSelect = document.getElementById('musica-album-select');
            musicaAlbumSelect.innerHTML = '<option value="">Selecione um álbum...</option>' + 
                albuns.map(alb => `<option value="${alb.id}">${escapeHtml(alb.titulo)}</option>`).join('');

            if (albuns.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5">Nenhum álbum cadastrado.</td></tr>';
                return;
            }

            tbody.innerHTML = albuns.map(a => `
                <tr>
                    <td><img src="${getCapaUrl(a)}" class="table-thumb" alt="Capa" onerror="this.src='assets/images/placeholder-album.svg'"></td>
                    <td><strong>${escapeHtml(a.titulo)}</strong></td>
                    <td>${escapeHtml(a.artista_nome)}</td>
                    <td>${escapeHtml(a.ano_lancamento)}</td>
                    <td>
                        <button class="btn btn-secondary btn-sm btn-edit" data-id="${a.id}">Editar</button>
                        <button class="btn btn-danger btn-sm btn-delete" data-id="${a.id}">Excluir</button>
                    </td>
                </tr>
            `).join('');

            // Eventos de edição e exclusão
            document.querySelectorAll('.btn-delete').forEach(btn => {
                btn.addEventListener('click', async () => {
                    if (confirm('Tem certeza que deseja excluir este álbum do acervo?')) {
                        try {
                            await API.deleteAlbum(btn.dataset.id);
                            showToast('Álbum excluído com sucesso.');
                            renderAlbunsTable();
                        } catch (err) {
                            showToast(err.message, 'error');
                        }
                    }
                });
            });

            document.querySelectorAll('.btn-edit').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const album = await API.getAlbumById(btn.dataset.id);
                    albumFormTitle.innerText = 'Editar Álbum';
                    albumIdInput.value = album.id;
                    document.getElementById('album-titulo').value = album.titulo;
                    albumArtistaSelect.value = album.artista_id;
                    albumGeneroSelect.value = album.genero_id || '';
                    document.getElementById('album-ano').value = album.ano_lancamento;
                    document.getElementById('album-gravadora').value = album.gravadora || '';
                    document.getElementById('album-descricao').value = album.descricao || '';
                    
                    if (album.capa_url) {
                        capaTipoRadios[0].checked = true;
                        capaTipoRadios[0].dispatchEvent(new Event('change'));
                        capaUrlInput.value = album.capa_url;
                    }

                    imagePreview.src = getCapaUrl(album);
                    albumSubmitBtn.innerText = 'Atualizar Álbum';
                    albumCancelBtn.classList.remove('hidden');
                });
            });

        } catch (e) {
            tbody.innerHTML = '<tr><td colspan="5">Erro ao listar álbuns.</td></tr>';
        }
    }

    // Reset de edição
    albumCancelBtn.addEventListener('click', () => {
        albumForm.reset();
        albumIdInput.value = '';
        albumFormTitle.innerText = 'Cadastrar Novo Álbum';
        albumSubmitBtn.innerText = 'Salvar Álbum';
        albumCancelBtn.classList.add('hidden');
        imagePreview.src = 'assets/images/placeholder-album.svg';
    });

    // Submissão do Formulário de Álbum
    albumForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(albumForm);

        if (albumIdInput.value) {
            formData.append('_method', 'PUT');
        }

        try {
            const res = await API.saveAlbum(formData);
            showToast(res.mensagem || 'Álbum salvo com sucesso!');
            albumCancelBtn.click();
            renderAlbunsTable();
        } catch (err) {
            showToast(err.message, 'error');
        }
    });

    // --- ARTISTAS ---
    async function renderArtistasTable() {
        const tbody = document.getElementById('table-artistas-body');
        try {
            const artistas = await API.getArtistas();
            tbody.innerHTML = artistas.map(a => `
                <tr>
                    <td>${a.id}</td>
                    <td>${escapeHtml(a.nome)}</td>
                    <td>${escapeHtml(a.pais_origem || '-')}</td>
                </tr>
            `).join('');
        } catch (e) {
            tbody.innerHTML = '<tr><td colspan="3">Erro ao carregar.</td></tr>';
        }
    }

    document.getElementById('artista-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            nome: document.getElementById('artista-nome').value,
            pais_origem: document.getElementById('artista-pais').value,
            biografia: document.getElementById('artista-bio').value
        };

        try {
            await API.saveArtista(data);
            showToast('Artista salvo com sucesso!');
            document.getElementById('artista-form').reset();
            loadSelectOptions();
            renderArtistasTable();
        } catch (err) {
            showToast(err.message, 'error');
        }
    });

    // --- MÚSICAS ---
    const musicaAlbumSelect = document.getElementById('musica-album-select');
    musicaAlbumSelect.addEventListener('change', async () => {
        const albumId = musicaAlbumSelect.value;
        const tbody = document.getElementById('table-musicas-body');

        if (!albumId) {
            tbody.innerHTML = '<tr><td colspan="4">Selecione um álbum.</td></tr>';
            return;
        }

        try {
            const musicas = await API.getMusicasByAlbum(albumId);
            if (musicas.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4">Nenhuma música neste álbum.</td></tr>';
                return;
            }

            tbody.innerHTML = musicas.map(m => `
                <tr>
                    <td>Lado ${escapeHtml(m.lado_vinil)} - Faixa ${m.numero_faixa}</td>
                    <td>${escapeHtml(m.titulo)}</td>
                    <td>${formatDuration(m.duracao_segundos)}</td>
                    <td>
                        <button class="btn btn-danger btn-sm btn-delete-musica" data-id="${m.id}">Excluir</button>
                    </td>
                </tr>
            `).join('');

            document.querySelectorAll('.btn-delete-musica').forEach(btn => {
                btn.addEventListener('click', async () => {
                    await API.deleteMusica(btn.dataset.id);
                    showToast('Música excluída.');
                    musicaAlbumSelect.dispatchEvent(new Event('change'));
                });
            });
        } catch (e) {
            tbody.innerHTML = '<tr><td colspan="4">Erro ao carregar faixas.</td></tr>';
        }
    });

    document.getElementById('musica-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            album_id: musicaAlbumSelect.value,
            titulo: document.getElementById('musica-titulo').value,
            lado_vinil: document.getElementById('musica-lado').value,
            numero_faixa: document.getElementById('musica-faixa').value,
            duracao_segundos: document.getElementById('musica-duracao').value
        };

        try {
            await API.saveMusica(data);
            showToast('Música adicionada!');
            document.getElementById('musica-titulo').value = '';
            musicaAlbumSelect.dispatchEvent(new Event('change'));
        } catch (err) {
            showToast(err.message, 'error');
        }
    });

    initAdmin();
});