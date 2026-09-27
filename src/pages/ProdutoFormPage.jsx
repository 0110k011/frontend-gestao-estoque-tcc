import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { buscarProduto } from '@/api/produtos';
import ProductForm from '@/components/ProductForm';

export default function ProdutoFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [produto, setProduto] = useState(null);
    const [carregando, setCarregando] = useState(!!id);

    const modoEdicao = !!id;

    useEffect(() => {
        if (!id) return;

        buscarProduto(id)
            .then(setProduto)
            .catch(() => navigate('/produtos', { replace: true }))
            .finally(() => setCarregando(false));
    }, [id, navigate]);

    const handleSucesso = () => {
        navigate('/produtos', { replace: true });
    };

    if (carregando) return <p>Carregando produto...</p>;

    return (
        <div className="page">
            <div className="page-header">
                <h1>{modoEdicao ? 'Editar Produto' : 'Novo Produto'}</h1>
            </div>

            <ProductForm produtoInicial={produto} onSucesso={handleSucesso} />
        </div>
    );
}