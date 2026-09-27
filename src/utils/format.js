/**
 * Formata um número como moeda brasileira (R$).
 * @param {number|string} valor
 * @returns {string} Ex.: "R$ 1.234,56"
 */
export function formatarMoeda(valor) {
    if (valor === null || valor === undefined || valor === '') return '—';

    const numero = typeof valor === 'string' ? parseFloat(valor) : valor;
    if (isNaN(numero)) return '—';

    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(numero);
}

/**
 * Formata uma data ISO 8601 no padrão brasileiro.
 * @param {string} dataIso Ex.: "2026-09-27T14:30:00"
 * @returns {string} Ex.: "27/09/2026 14:30"
 */
export function formatarData(dataIso) {
    if (!dataIso) return '—';

    try {
        const data = new Date(dataIso);
        if (isNaN(data.getTime())) return '—';

        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(data);
    } catch {
        return '—';
    }
}

/**
 * Formata uma data ISO no formato apenas de data (sem hora).
 * @param {string} dataIso
 * @returns {string} Ex.: "27/09/2026"
 */
export function formatarDataCurta(dataIso) {
    if (!dataIso) return '—';

    try {
        const data = new Date(dataIso);
        if (isNaN(data.getTime())) return '—';

        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(data);
    } catch {
        return '—';
    }
}

/**
 * Trunca um texto longo para exibição em tabelas.
 * @param {string} texto
 * @param {number} limite
 * @returns {string}
 */
export function truncar(texto, limite = 30) {
    if (!texto) return '—';
    return texto.length > limite ? `${texto.substring(0, limite)}...` : texto;
}

/**
 * Formata um número inteiro com separador de milhar.
 * @param {number} valor
 * @returns {string} Ex.: "1.234"
 */
export function formatarNumero(valor) {
    if (valor === null || valor === undefined) return '—';
    return new Intl.NumberFormat('pt-BR').format(valor);
}