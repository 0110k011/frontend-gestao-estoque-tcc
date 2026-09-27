import { useState, useEffect } from 'react';
import { registrarMovimentacao } from '@/api/movimentacoes';
import { listarProdutos } from '@/api/produtos';

/**
 * Formulário de movimentação de estoque.
 * @param {{ onSucesso? }} props
 */
export default function MovementForm({ onSucesso }) {
    const [form, setForm] = useState({
        produtoId: '',
        tipo: 'ENTRADA',
        quantidade: 1,
        valorUnitario: '',
        observacao: '',
    });
    const [produtos, setProdutos] = useState([]);
    const [erros, setErros] = useState({});
    const [erroGeral, setErroGeral] = useState(null);
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        listarProdutos({ page: 0, size: 100, sort: 'nome,asc' })
            .then((pagina) => setProdutos(pagina.content))
            .catch(() => setProdutos([]));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErros((prev) => ({ ...prev, [name]: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErros({});
        setErroGeral(null);
        setSalvando(true);

        try {
            const payload = {
                produtoId: parseInt(form.produtoId, 10),
                tipo: form.tipo,
                quantidade: parseInt(form.quantidade, 10),
                valorUnitario: parseFloat(form.valorUnitario),
                observacao: form.observacao || null,
            };

            await registrarMovimentacao(payload);
            onSucesso?.();
        } catch (erro) {
            if (erro.campos?.length) {
                setErros(
                    Object.fromEntries(erro.campos.map((c) => [c.campo, c.mensagem]))
                );
            } else {
                setErroGeral(erro.detalhe || 'Erro ao registrar movimentação.');
            }
        } finally {
            setSalvando(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="movement-form">
            {erroGeral && <div className="erro-geral">{erroGeral}</div>}

            <label>
                Produto
                <select
                    name="produtoId"
                    value={form.produtoId}
                    onChange={handleChange}
                    required
                >
                    <option value="">Selecione...</option>
                    {produtos.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.sku} — {p.nome} (saldo: {p.quantidadeEstoque})
                        </option>
                    ))}
                </select>
                {erros.produtoId && (
                    <span className="erro-campo">{erros.produtoId}</span>
                )}
            </label>

            <label>
                Tipo de Movimentação
                <select name="tipo" value={form.tipo} onChange={handleChange}>
                    <option value="ENTRADA">Entrada</option>
                    <option value="SAIDA">Saída</option>
                </select>
            </label>

            <label>
                Quantidade
                <input
                    type="number"
                    name="quantidade"
                    min="1"
                    value={form.quantidade}
                    onChange={handleChange}
                    required
                />
                {erros.quantidade && (
                    <span className="erro-campo">{erros.quantidade}</span>
                )}
            </label>

            <label>
                Valor Unitário
                <input
                    type="number"
                    step="0.01"
                    name="valorUnitario"
                    value={form.valorUnitario}
                    onChange={handleChange}
                    required
                />
                {erros.valorUnitario && (
                    <span className="erro-campo">{erros.valorUnitario}</span>
                )}
            </label>

            <label>
                Observação
                <textarea
                    name="observacao"
                    value={form.observacao}
                    onChange={handleChange}
                    maxLength={255}
                />
            </label>

            <button type="submit" disabled={salvando}>
                {salvando ? 'Registrando...' : 'Registrar Movimentação'}
            </button>
        </form>
    );
}