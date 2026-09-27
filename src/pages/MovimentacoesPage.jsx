import { useState } from 'react';
import MovementForm from '@/components/MovementForm';
import { listarMovimentacoesPorProduto } from '@/api/movimentacoes';
import { listarProdutos } from '@/api/produtos';
import { formatarData, formatarMoeda } from '@/utils/format';
import { useEffect } from 'react';

export default function MovimentacoesPage() {
    const [sucesso, setSucesso] = useState(null);
    const [produtoSelecionado, setProdutoSelecionado] = useState('');
    const [produtos, setProdutos] = useState([]);
    const [historico, setHistorico] = useState([]);
    const [carregandoHistorico, setCarregandoHistorico] = useState(false);

    useEffect(() => {
        listarProdutos({ page: 0, size: 100, sort: 'nome,asc' })
            .then((p) => setProdutos(p.content))
            .catch(() => setProdutos([]));
    }, []);

    useEffect(() => {
        if (!produtoSelecionado) {
            setHistorico([]);
            return;
        }

        setCarregandoHistorico(true);
        listarMovimentacoesPorProduto(produtoSelecionado, { page: 0, size: 20 })
            .then((pagina) => setHistorico(pagina.content))
            .catch(() => setHistorico([]))
            .finally(() => setCarregandoHistorico(false));
    }, [produtoSelecionado]);

    const handleSucesso = () => {
        setSucesso('Movimentação registrada com sucesso.');
        // Recarrega o histórico
        if (produtoSelecionado) {
            listarMovimentacoesPorProduto(produtoSelecionado, { page: 0, size: 20 })
                .then((pagina) => setHistorico(pagina.content))
                .catch(() => {});
        }
        setTimeout(() => setSucesso(null), 3000);
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>Movimentações de Estoque</h1>
            </div>

            {sucesso && <div className="sucesso-geral">{sucesso}</div>}

            <section className="secao-form">
                <h2>Registrar Movimentação</h2>
                <MovementForm onSucesso={handleSucesso} />
            </section>

            <section className="secao-historico">
                <h2>Histórico por Produto</h2>

                <select
                    value={produtoSelecionado}
                    onChange={(e) => setProdutoSelecionado(e.target.value)}
                >
                    <option value="">Selecione um produto...</option>
                    {produtos.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.sku} — {p.nome}
                        </option>
                    ))}
                </select>

                {carregandoHistorico && <p>Carregando histórico...</p>}

                {!carregandoHistorico && historico.length === 0 && produtoSelecionado && (
                    <p>Nenhuma movimentação registrada para este produto.</p>
                )}

                {historico.length > 0 && (
                    <table className="tabela-historico">
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Tipo</th>
                                <th>Quantidade</th>
                                <th>Valor Unitário</th>
                                <th>Observação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historico.map((m) => (
                                <tr key={m.id}>
                                    <td>{formatarData(m.dataHora)}</td>
                                    <td>
                                        <span className={`tipo-${m.tipo.toLowerCase()}`}>
                                            {m.tipo}
                                        </span>
                                    </td>
                                    <td>{m.quantidade}</td>
                                    <td>{formatarMoeda(m.valorUnitario)}</td>
                                    <td>{m.observacao || '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>
        </div>
    );
}