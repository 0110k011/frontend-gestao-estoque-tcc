import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
    listarCategorias,
    criarCategoria,
    inativarCategoria,
} from '@/api/categorias';

export default function CategoriasPage() {
    const { isAdmin } = useAuth();
    const [categorias, setCategorias] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [form, setForm] = useState({ nome: '', descricao: '' });
    const [erro, setErro] = useState(null);
    const [sucesso, setSucesso] = useState(null);

    const carregar = () => {
        setCarregando(true);
        listarCategorias()
            .then(setCategorias)
            .catch((e) => setErro(e.detalhe))
            .finally(() => setCarregando(false));
    };

    useEffect(() => {
        carregar();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro(null);
        setSucesso(null);

        try {
            await criarCategoria(form);
            setForm({ nome: '', descricao: '' });
            setSucesso('Categoria criada com sucesso.');
            carregar();
            setTimeout(() => setSucesso(null), 3000);
        } catch (e) {
            setErro(e.detalhe || 'Erro ao criar categoria.');
        }
    };

    const handleInativar = async (id) => {
        if (!confirm('Deseja realmente inativar esta categoria?')) return;

        try {
            await inativarCategoria(id);
            carregar();
        } catch (e) {
            setErro(e.detalhe || 'Erro ao inativar categoria.');
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>Categorias</h1>
            </div>

            {erro && <div className="erro-geral">{erro}</div>}
            {sucesso && <div className="sucesso-geral">{sucesso}</div>}

            {isAdmin && (
                <section className="secao-form">
                    <h2>Nova Categoria</h2>
                    <form onSubmit={handleSubmit} className="form-inline">
                        <input
                            type="text"
                            placeholder="Nome da categoria"
                            value={form.nome}
                            onChange={(e) =>
                                setForm((p) => ({ ...p, nome: e.target.value }))
                            }
                            required
                        />
                        <input
                            type="text"
                            placeholder="Descrição (opcional)"
                            value={form.descricao}
                            onChange={(e) =>
                                setForm((p) => ({ ...p, descricao: e.target.value }))
                            }
                        />
                        <button type="submit">Criar</button>
                    </form>
                </section>
            )}

            <section className="secao-lista">
                {carregando && <p>Carregando categorias...</p>}

                {!carregando && categorias.length === 0 && (
                    <p>Nenhuma categoria cadastrada.</p>
                )}

                {categorias.length > 0 && (
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Descrição</th>
                                <th>Status</th>
                                {isAdmin && <th>Ações</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {categorias.map((c) => (
                                <tr key={c.id}>
                                    <td>{c.id}</td>
                                    <td>{c.nome}</td>
                                    <td>{c.descricao || '—'}</td>
                                    <td>{c.ativo ? 'Ativa' : 'Inativa'}</td>
                                    {isAdmin && (
                                        <td>
                                            <button
                                                onClick={() => handleInativar(c.id)}
                                                className="btn-danger"
                                            >
                                                Inativar
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>
        </div>
    );
}