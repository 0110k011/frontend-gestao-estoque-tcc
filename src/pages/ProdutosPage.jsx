import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import StockList from '@/components/StockList';

export default function ProdutosPage() {
    const { isAdmin } = useAuth();
    const navigate = useNavigate();

    const [filtroNome, setFiltroNome] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('');

    return (
        <div className="page">
            <div className="page-header">
                <h1>Produtos</h1>
                {isAdmin && (
                    <Link to="/produtos/novo" className="btn btn-primary">
                        + Novo Produto
                    </Link>
                )}
            </div>

            <div className="filtros">
                <input
                    type="text"
                    placeholder="Buscar por nome..."
                    value={filtroNome}
                    onChange={(e) => setFiltroNome(e.target.value)}
                />
                {/* <input
                    type="number"
                    placeholder="Filtrar por ID de categoria..."
                    value={filtroCategoria}
                    onChange={(e) => setFiltroCategoria(e.target.value)}
                /> */}
            </div>

            <StockList
                filtroNome={filtroNome}
                filtroCategoria={filtroCategoria}
            />
        </div>
    );
}