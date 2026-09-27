import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
    const { registrar } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        nome: '',
        email: '',
        senha: '',
        confirmarSenha: '',
    });
    const [erros, setErros] = useState({});
    const [erroGeral, setErroGeral] = useState(null);
    const [carregando, setCarregando] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErros((prev) => ({ ...prev, [name]: null }));
        setErroGeral(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErros({});
        setErroGeral(null);

        // Validação local: confirmação de senha
        if (form.senha !== form.confirmarSenha) {
            setErros({ confirmarSenha: 'As senhas não coincidem' });
            return;
        }

        setCarregando(true);
        try {
            await registrar({
                nome: form.nome,
                email: form.email,
                senha: form.senha,
            });
            navigate('/produtos', { replace: true });
        } catch (erro) {
            if (erro.campos?.length) {
                setErros(
                    Object.fromEntries(erro.campos.map((c) => [c.campo, c.mensagem]))
                );
            } else {
                setErroGeral(erro.detalhe || 'Erro ao criar conta.');
            }
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Criar Conta</h1>
                <p className="auth-subtitulo">
                    Registre-se para acessar o sistema
                </p>

                {erroGeral && <div className="erro-geral">{erroGeral}</div>}

                <form onSubmit={handleSubmit}>
                    <label>
                        Nome completo
                        <input
                            type="text"
                            name="nome"
                            value={form.nome}
                            onChange={handleChange}
                            maxLength={150}
                            required
                        />
                        {erros.nome && <span className="erro-campo">{erros.nome}</span>}
                    </label>

                    <label>
                        E-mail
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                        />
                        {erros.email && <span className="erro-campo">{erros.email}</span>}
                    </label>

                    <label>
                        Senha
                        <input
                            type="password"
                            name="senha"
                            value={form.senha}
                            onChange={handleChange}
                            minLength={8}
                            maxLength={100}
                            autoComplete="new-password"
                            required
                        />
                        {erros.senha && <span className="erro-campo">{erros.senha}</span>}
                    </label>

                    <label>
                        Confirmar senha
                        <input
                            type="password"
                            name="confirmarSenha"
                            value={form.confirmarSenha}
                            onChange={handleChange}
                            minLength={8}
                            maxLength={100}
                            autoComplete="new-password"
                            required
                        />
                        {erros.confirmarSenha && (
                            <span className="erro-campo">{erros.confirmarSenha}</span>
                        )}
                    </label>

                    <button type="submit" disabled={carregando}>
                        {carregando ? 'Criando conta...' : 'Criar conta'}
                    </button>
                </form>

                <p className="auth-link">
                    Já tem conta? <Link to="/login">Entrar</Link>
                </p>
            </div>
        </div>
    );
}