import axios from 'axios';

// URL base da API — configurada via .env.local
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * Instância Axios centralizada.
 * Todas as chamadas HTTP do frontend passam por aqui.
 */
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 segundos
});

// ============================================================
// INTERCEPTADOR DE REQUISIÇÃO
// Injeta o token JWT no header Authorization
// ============================================================
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ============================================================
// INTERCEPTADOR DE RESPOSTA
// Trata 401 (redireciona para login) e normaliza erros RFC 7807
// ============================================================
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Token ausente, inválido ou expirado → redireciona para login
        if (error.response?.status === 401) {
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('usuario');
            // Evita loop infinito se já estiver na tela de login
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(normalizarErro(error));
    }
);

/**
 * Normaliza o erro no formato RFC 7807 retornado pelo backend.
 * O backend responde erros no formato:
 * {
 *   "type": "...",
 *   "title": "...",
 *   "status": 400,
 *   "detail": "...",
 *   "instance": "...",
 *   "timestamp": "...",
 *   "invalidParams": [{ "campo": "...", "mensagem": "..." }]
 * }
 */
function normalizarErro(error) {
    const problem = error.response?.data;

    // Caso 1: erro RFC 7807 (backend respondeu com ProblemDetail)
    if (problem?.title && problem?.status) {
        return {
            status: problem.status,
            titulo: problem.title,
            detalhe: problem.detail,
            campos: problem.invalidParams || [],
        };
    }

    // Caso 2: erro de rede (timeout, servidor offline)
    if (!error.response) {
        return {
            status: 0,
            titulo: 'Erro de conexão',
            detalhe: 'Não foi possível contactar o servidor. Verifique sua conexão.',
            campos: [],
        };
    }

    // Caso 3: erro inesperado
    return {
        status: error.response.status,
        titulo: 'Erro inesperado',
        detalhe: error.message || 'Ocorreu um erro inesperado.',
        campos: [],
    };
}