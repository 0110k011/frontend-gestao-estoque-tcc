import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';

import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ProdutosPage from '@/pages/ProdutosPage';
import ProdutoFormPage from '@/pages/ProdutoFormPage';
import MovimentacoesPage from '@/pages/MovimentacoesPage';
import CategoriasPage from '@/pages/CategoriasPage';

/**
 * Componente raiz da aplicação.
 * Define o roteamento e envolve tudo com o AuthProvider.
 */
export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* ===== Rotas públicas ===== */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* ===== Rotas protegidas (exigem autenticação) ===== */}
                    <Route
                        path="/produtos"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <ProdutosPage />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/produtos/novo"
                        element={
                            <ProtectedRoute exigirAdmin>
                                <Layout>
                                    <ProdutoFormPage />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/produtos/:id/editar"
                        element={
                            <ProtectedRoute exigirAdmin>
                                <Layout>
                                    <ProdutoFormPage />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/movimentacoes"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <MovimentacoesPage />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/categorias"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <CategoriasPage />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    {/* ===== Redirecionamentos ===== */}
                    <Route path="/" element={<Navigate to="/produtos" replace />} />
                    <Route path="*" element={<Navigate to="/produtos" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}