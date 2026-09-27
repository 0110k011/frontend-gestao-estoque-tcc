import { useState, useEffect } from 'react';
import { criarProduto, atualizarProduto } from '@/api/produtos';
import { listarCategorias } from '@/api/categorias';

/**
 * Formulário de produto.
 * @param {{ produtoInicial?, onSucesso? }} props
 */
export default function ProductForm({ produtoInicial = null, onSucesso }) {
    const [form, setForm] = useState({
        sku: '',
        nome: '',
        descricao: '',
        precoCusto: '',
        precoVenda: '',
        estoqueMinimo: 0,
        categoriaId: '',
    });
    const [categorias, setCategorias] = useState([]);
    const [erros, setErros] = useState({});
    const [erroGeral, setErroGeral] = useState(null);
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        if (produtoInicial) {
            setForm({
                sku: produtoInicial.sku || '',
                nome: produtoInicial.nome || '',
                descricao: produtoInicial.descricao || '',
                precoCusto: produtoInicial.precoCusto ?? '',
                precoVenda: produtoInicial.precoVenda ?? '',
                estoqueMinimo: produtoInicial.estoqueMinimo ?? 0,
                categoriaId: produtoInicial.categoriaId ?? '',
            });
        }
    }, [produtoInicial]);

    useEffect(() => {
        listarCategorias()
            .then(setCategorias)
            .catch(() => setCategorias([]));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        // Limpa o erro do campo sendo editado
        setErros((prev) => ({ ...prev, [name]: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErros({});
        setErroGeral(null);
        setSalvando(true);

        try {
            const payload = {
                ...form,
                precoCusto: parseFloat(form.precoCusto),
                precoVenda: parseFloat(form.precoVenda),
                estoqueMinimo: parseInt(form.estoqueMinimo, 10),
                categoriaId: parseInt(form.categoriaId, 10),
            };

            if (produtoInicial?.id) {
                await atualizarProduto(produtoInicial.id, payload);
            } else {
                await criarProduto(payload);
            }

            onSucesso?.();
        } catch (erro) {
            if (erro.campos?.length) {
                setErros(
                    Object.fromEntries(erro.campos.map((c) => [c.campo, c.mensagem]))
                );
            } else {
                setErroGeral(erro.detalhe || 'Erro ao salvar produto.');
            }
        } finally {
            setSalvando(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="product-form">
            {erroGeral && <div className="erro-geral">{erroGeral}</div>}

            <label>
                SKU
                <input
                    name="sku"
                    value={form.sku}
                    onChange={handleChange}
                    required
                />
                {erros.sku && <span className="erro-campo">{erros.sku}</span>}
            </label>

            <label>
                Nome
                <input
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    required
                />
                {erros.nome && <span className="erro-campo">{erros.nome}</span>}
            </label>

            <label>
                Descrição
                <textarea
                    name="descricao"
                    value={form.descricao}
                    onChange={handleChange}
                />
            </label>

            <label>
                Preço de Custo
                <input
                    type="number"
                    step="0.01"
                    name="precoCusto"
                    value={form.precoCusto}
                    onChange={handleChange}
                    required
                />
                {erros.precoCusto && (
                    <span className="erro-campo">{erros.precoCusto}</span>
                )}
            </label>

            <label>
                Preço de Venda
                <input
                    type="number"
                    step="0.01"
                    name="precoVenda"
                    value={form.precoVenda}
                    onChange={handleChange}
                    required
                />
                {erros.precoVenda && (
                    <span className="erro-campo">{erros.precoVenda}</span>
                )}
            </label>

            <label>
                Estoque Mínimo
                <input
                    type="number"
                    name="estoqueMinimo"
                    value={form.estoqueMinimo}
                    onChange={handleChange}
                />
            </label>

            <label>
                Categoria
                <select
                    name="categoriaId"
                    value={form.categoriaId}
                    onChange={handleChange}
                    required
                >
                    <option value="">Selecione...</option>
                    {categorias.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.nome}
                        </option>
                    ))}
                </select>
                {erros.categoriaId && (
                    <span className="erro-campo">{erros.categoriaId}</span>
                )}
            </label>

            <button type="submit" disabled={salvando}>
                {salvando ? 'Salvando...' : 'Salvar'}
            </button>
        </form>
    );
}