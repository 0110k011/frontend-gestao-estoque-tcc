import { apiClient } from './client';

/**
 * Lista todas as categorias ativas.
 * @returns {Promise<Array<{ id, nome, descricao, ativo }>>}
 */
export async function listarCategorias() {
    const { data } = await apiClient.get('/api/v1/categorias');
    return data;
}

/**
 * Busca uma categoria por ID.
 */
export async function buscarCategoria(id) {
    const { data } = await apiClient.get(`/api/v1/categorias/${id}`);
    return data;
}

/**
 * Cria uma nova categoria. Requer perfil ADMIN.
 */
export async function criarCategoria(categoria) {
    const { data } = await apiClient.post('/api/v1/categorias', categoria);
    return data;
}

/**
 * Atualiza uma categoria existente. Requer perfil ADMIN.
 */
export async function atualizarCategoria(id, categoria) {
    const { data } = await apiClient.put(`/api/v1/categorias/${id}`, categoria);
    return data;
}

/**
 * Inativa uma categoria (exclusão lógica). Requer perfil ADMIN.
 */
export async function inativarCategoria(id) {
    await apiClient.delete(`/api/v1/categorias/${id}`);
}