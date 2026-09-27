import { useState, useEffect, useCallback } from 'react';
import { listarProdutos, buscarProdutosPorNome } from '@/api/produtos';
import AlertBadge from './AlertBadge';
import { formatarMoeda } from '@/utils/format';

/**
 * Tabela reativa de produtos.
 * @param {{ filtroNome?, filtroCategoria? }} props
 */
export default function StockList({ filtroNome, filtroCategoria }) {
    const [produtos, setProdutos] = useState([]);
    const [pagina, setPagina] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState(null);

    const carregarProdutos = useCallback(async () => {
        setCarregando(true);
        setErro(null);

        try {
            const params = {
                page: pagina,
                size: 20,
                sort: 'nome,asc',
            };
            let functionType = listarProdutos(params);
            if (filtroNome) functionType = buscarProdutosPorNome(filtroNome, params);
            // if (filtroCategoria > 0) functionType = listarProdutosPorCategoria(filtroCategoria);

            const data = await functionType;
            setProdutos(data.content);
            setTotalPaginas(data.totalPages);
        } catch (e) {
            setErro(e);
        } finally {
            setCarregando(false);
        }
    }, [pagina, filtroNome, filtroCategoria]);

    useEffect(() => {
        carregarProdutos();
    }, [carregarProdutos]);

    if (carregando && produtos.length === 0) {
        return <p>Carregando produtos...</p>;
    }

    if (erro) {
        return (
            <div className="erro-container">
                <strong>{erro.titulo}</strong>
                <p>{erro.detalhe}</p>
            </div>
        );
    }

    if (produtos.length === 0) {
        return <p>Nenhum produto cadastrado.</p>;
    }

    return (
        <div className="stock-list">
            <table>
                <thead>
                    <tr>
                        <th>SKU</th>
                        <th>Nome</th>
                        <th>Categoria</th>
                        <th>Preço Venda</th>
                        <th>Estoque</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {produtos.map((produto) => (
                        <tr
                            key={produto.id}
                            className={produto.abaixoDoMinimo ? 'linha-critica' : ''}
                        >
                            <td>{produto.sku}</td>
                            <td>{produto.nome}</td>
                            <td>{produto.categoriaNome}</td>
                            <td>{formatarMoeda(produto.precoVenda)}</td>
                            <td>{produto.quantidadeEstoque}</td>
                            <td>
                                {produto.abaixoDoMinimo ? (
                                    <AlertBadge tipo="critico" texto="Estoque baixo" />
                                ) : (
                                    <AlertBadge tipo="ok" texto="Normal" />
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="paginacao">
                <button
                    disabled={pagina === 0}
                    onClick={() => setPagina((p) => p - 1)}
                >
                    Anterior
                </button>
                <span>
                    Página {pagina + 1} de {totalPaginas || 1}
                </span>
                <button
                    disabled={pagina >= totalPaginas - 1}
                    onClick={() => setPagina((p) => p + 1)}
                >
                    Próxima
                </button>
            </div>
        </div>
    );
}