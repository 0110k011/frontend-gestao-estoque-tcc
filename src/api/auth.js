import { apiClient } from './client';

/**
 * Autentica o usuário e retorna um token JWT.
 * @param {{ email: string, senha: string }} credenciais
 * @returns {Promise<{ token: string, tipo: string, expiraEm: number }>}
 */
export async function login(credenciais) {
    const { data } = await apiClient.post('/api/v1/auth/login', credenciais);
    return data;
}

/**
 * Registra um novo usuário.
 * O perfil é sempre OPERADOR — a criação de ADMIN é feita via bootstrap.
 * @param {{ nome: string, email: string, senha: string }} dados
 * @returns {Promise<{ token: string, tipo: string, expiraEm: number }>}
 */
export async function registrar(dados) {
    const { data } = await apiClient.post('/api/v1/auth/register', dados);
    return data;
}

/**
 * Remove o token JWT do armazenamento local.
 * Não chama o backend — o JWT é stateless.
 */
export function logout() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('usuario');
}

/**
 * Verifica se existe um token JWT válido no armazenamento local.
 */
export function estaAutenticado() {
    return !!localStorage.getItem('jwt_token');
}