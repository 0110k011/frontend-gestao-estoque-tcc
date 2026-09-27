import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState({ email: '', senha: '' });
    const [erro, setErro] = useState(null);
    const [carregando, setCarregando] = useState(false);

    // Se o usuário foi redirecionado de uma rota protegida,
    // volta para ela após o login. Caso contrário, vai para /produtos.
    const destino = location.state?.from?.pathname || '/produtos';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErro(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro(null);
        setCarregando(true);

        try {
            await login(form);
            navigate(destino, { replace: true });
        } catch (erro) {
            setErro(erro.detalhe || 'Falha ao autenticar. Verifique suas credenciais.');
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Entrar</h1>
                <p className="auth-subtitulo">
                    Acesse o sistema de controle de estoque
                </p>

                {erro && <div className="erro-geral">{erro}</div>}

                <form onSubmit={handleSubmit}>
                    <label>
                        E-mail
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="seu@email.com"
                            autoComplete="email"
                            required
                        />
                    </label>

                    <label>
                        Senha
                        <input
                            type="password"
                            name="senha"
                            value={form.senha}
                            onChange={handleChange}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            required
                        />
                    </label>

                    <button type="submit" disabled={carregando}>
                        {carregando ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                <p className="auth-link">
                    Não tem conta? <Link to="/register">Cadastre-se</Link>
                </p>
            </div>
        </div>
    );
}