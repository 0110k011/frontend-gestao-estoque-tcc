import { apiClient } from './client';

/**
 * Registra uma movimentação de entrada ou saída no estoque.
 * @param {{ produtoId, tipo, quantidade, valorUnitario, observacao }} movimentacao
 * @returns {Promise<MovimentacaoResponse>}
 */
export async function registrarMovimentacao(movimentacao) {
    const { data } = await apiClient.post('/api/v1/movimentacoes', movimentacao);
    return data;
}

/**
 * Lista movimentações de um produto específico (paginado).
 */
export async function listarMovimentacoesPorProduto(produtoId, params = {}) {
    const { data } = await apiClient.get(
        `/api/v1/movimentacoes/produto/${produtoId}`,
        { params }
    );
    return data;
}