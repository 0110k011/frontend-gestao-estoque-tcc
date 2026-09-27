/**
 * Tipos de movimentação de estoque.
 * Devem corresponder ao enum TipoMovimentacao do backend.
 */
export const TIPOS_MOVIMENTACAO = {
    ENTRADA: 'ENTRADA',
    SAIDA: 'SAIDA',
};

/**
 * Perfis de usuário.
 * Devem corresponder ao enum Perfil do backend.
 */
export const PERFIS = {
    ADMIN: 'ADMIN',
    OPERADOR: 'OPERADOR',
};

/**
 * Chaves usadas no localStorage.
 */
export const STORAGE_KEYS = {
    TOKEN: 'jwt_token',
    USUARIO: 'usuario',
};

/**
 * Mensagens de erro padrão (fallback).
 */
export const MENSAGENS = {
    ERRO_CONEXAO: 'Não foi possível contactar o servidor. Verifique sua conexão.',
    ERRO_INESPERADO: 'Ocorreu um erro inesperado. Tente novamente.',
    SUCESSO_PADRAO: 'Operação realizada com sucesso.',
};

/**
 * Configurações de paginação.
 */
export const PAGINACAO = {
    TAMANHO_PADRAO: 20,
    ORDENACAO_PADRAO: 'nome,asc',
};