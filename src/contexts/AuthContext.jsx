import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authApi from '@/api/auth';

/**
 * Contexto global de autenticação.
 * Expõe: usuario, token, autenticado, carregando, login, registrar, logout.
 */
const AuthContext = createContext(null);

/**
 * Provider que envolve toda a aplicação.
 * Deve ser colocado dentro do <BrowserRouter> em App.jsx.
 */
export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [token, setToken] = useState(null);
    const [carregando, setCarregando] = useState(true);

    // ============================================================
    // Restaura a sessão ao montar o componente
    // Lê token e usuário do localStorage (se existirem)
    // ============================================================
    useEffect(() => {
        const tokenSalvo = localStorage.getItem('jwt_token');
        const usuarioSalvo = localStorage.getItem('usuario');

        if (tokenSalvo && usuarioSalvo) {
            try {
                setToken(tokenSalvo);
                setUsuario(JSON.parse(usuarioSalvo));
            } catch (e) {
                // JSON corrompido → limpa tudo
                localStorage.removeItem('jwt_token');
                localStorage.removeItem('usuario');
            }
        }
        setCarregando(false);
    }, []);

    // ============================================================
    // Persiste token e usuário no localStorage
    // ============================================================
    const persistirSessao = useCallback((tokenRecebido, usuarioRecebido) => {
        localStorage.setItem('jwt_token', tokenRecebido);
        localStorage.setItem('usuario', JSON.stringify(usuarioRecebido));
        setToken(tokenRecebido);
        setUsuario(usuarioRecebido);
    }, []);

    // ============================================================
    // Login
    // ============================================================
    const login = useCallback(async (credenciais) => {
        const resposta = await authApi.login(credenciais);

        // O backend retorna { token, tipo, expiraEm }.
        // Decodificamos o payload do JWT para extrair o usuário.
        const usuarioDecodificado = decodificarJwt(resposta.token);

        persistirSessao(resposta.token, usuarioDecodificado);
        return usuarioDecodificado;
    }, [persistirSessao]);

    // ============================================================
    // Registro (sempre cria OPERADOR no backend)
    // ============================================================
    const registrar = useCallback(async (dados) => {
        const resposta = await authApi.registrar(dados);

        const usuarioDecodificado = decodificarJwt(resposta.token);

        persistirSessao(resposta.token, usuarioDecodificado);
        return usuarioDecodificado;
    }, [persistirSessao]);

    // ============================================================
    // Logout
    // ============================================================
    const logout = useCallback(() => {
        authApi.logout();
        setToken(null);
        setUsuario(null);
    }, []);

    // ============================================================
    // Valor exposto pelo contexto
    // ============================================================
    const valor = {
        usuario,
        token,
        autenticado: !!token,
        carregando,
        isAdmin: usuario?.perfil === 'ADMIN',
        login,
        registrar,
        logout,
    };

    return (
        <AuthContext.Provider value={valor}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Hook para consumir o contexto de autenticação.
 * Lança erro se usado fora do <AuthProvider>.
 */
export function useAuth() {
    const contexto = useContext(AuthContext);
    if (!contexto) {
        throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
    }
    return contexto;
}

// ============================================================
// Utilitário: decodifica o payload de um JWT
// ============================================================
function decodificarJwt(token) {
    try {
        const payloadBase64 = token.split('.')[1];
        // Base64URL → Base64 padrão
        const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
        const json = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        const payload = JSON.parse(json);

        return {
            email: payload.sub,
            authorities: payload.authorities || [],
            perfil: extrairPerfil(payload.authorities),
            expiraEm: payload.exp ? payload.exp * 1000 : null,
        };
    } catch (e) {
        return { email: null, authorities: [], perfil: null, expiraEm: null };
    }
}

/**
 * Extrai o perfil (ADMIN/OPERADOR) das authorities do JWT.
 */
function extrairPerfil(authorities) {
    if (!authorities || authorities.length === 0) return null;
    const role = authorities[0]?.authority || authorities[0];
    if (typeof role === 'string' && role.startsWith('ROLE_')) {
        return role.replace('ROLE_', '');
    }
    return null;
}