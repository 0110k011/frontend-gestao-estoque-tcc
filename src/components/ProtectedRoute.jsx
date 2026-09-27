import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Wrapper de rotas autenticadas.
 * - Se carregando: exibe spinner (evita flash de redirecionamento)
 * - Se não autenticado: redireciona para /login preservando a rota original
 * - Se autenticado: renderiza o children
 */
export default function ProtectedRoute({ children, exigirAdmin = false }) {
    const { autenticado, carregando, isAdmin } = useAuth();
    const location = useLocation();

    if (carregando) {
        return (
            <div className="spinner-container">
                <div className="spinner" />
                <p>Carregando...</p>
            </div>
        );
    }

    if (!autenticado) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (exigirAdmin && !isAdmin) {
        return (
            <div className="acesso-negado">
                <h2>Acesso negado</h2>
                <p>Apenas administradores podem acessar esta página.</p>
            </div>
        );
    }

    return children;
}