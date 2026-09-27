import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function Layout({ children }) {
    const { usuario, isAdmin, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    return (
        <div className="layout">
            <header className="layout-header">
                <div className="logo">
                    <Link to="/produtos">Gestão de Estoque</Link>
                </div>

                <nav className="layout-nav">
                    <Link to="/produtos">Produtos</Link>
                    <Link to="/categorias">Categorias</Link>
                    <Link to="/movimentacoes">Movimentações</Link>
                </nav>

                <div className="layout-user">
                    <span>{usuario?.email}</span>
                    {isAdmin && <span className="badge-admin">ADMIN</span>}
                    <button onClick={handleLogout}>Sair</button>
                </div>
            </header>

            <main className="layout-main">
                {children}
            </main>

            <footer className="layout-footer">
                <small>Sistema de Controle de Estoque © 2026</small>
            </footer>
        </div>
    );
}