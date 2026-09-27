/**
 * Badge visual de status.
 * @param {{ tipo: 'critico' | 'alerta' | 'ok', texto: string }} props
 */
export default function AlertBadge({ tipo = 'ok', texto }) {
    const classes = {
        critico: 'badge badge-critico',
        alerta: 'badge badge-alerta',
        ok: 'badge badge-ok',
    };

    return (
        <span className={classes[tipo] || classes.ok}>
            {texto}
        </span>
    );
}