import { apiClient } from './client';

/**
 * Lista produtos ativos de forma paginada.
 * @param {{ page?, size?, sort?, nome?, categoriaId? }} params
 * @returns {Promise<{ content, totalElements, totalPages, number, size }>}
 */
export async function listarProdutos(params = {}) {
    const { data } = await apiClient.get('/api/v1/produtos', { params });
    return data;
}

/**
 * Busca produtos por nome (paginado).
 */
export async function buscarProdutosPorNome(nome, params = {}) {
    const { data } = await apiClient.get('/api/v1/produtos/buscar', {
        params: { nome, ...params },
    });
    return data;
}

/**
 * Lista produtos de uma categoria específica (paginado).
 */
export async function listarProdutosPorCategoria(categoriaId, params = {}) {
    const { data } = await apiClient.get(`/api/v1/produtos/categoria/${categoriaId}`, {
        params,
    });
    return data;
}

/**
 * Busca um produto por ID.
 */
export async function buscarProduto(id) {
    const { data } = await apiClient.get(`/api/v1/produtos/${id}`);
    return data;
}

/**
 * Cria um novo produto. Requer perfil ADMIN.
 */
export async function criarProduto(produto) {
    const { data } = await apiClient.post('/api/v1/produtos', produto);
    return data;
}

/**
 * Atualiza um produto existente. Requer perfil ADMIN.
 */
export async function atualizarProduto(id, produto) {
    const { data } = await apiClient.put(`/api/v1/produtos/${id}`, produto);
    return data;
}

/**
 * Inativa um produto (exclusão lógica). Requer perfil ADMIN.
 */
export async function inativarProduto(id) {
    await apiClient.delete(`/api/v1/produtos/${id}`);
}