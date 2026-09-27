// benchmark/movimentacao-entrada.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '5s',  target: 20 },  // ramp-up
        { duration: '30s', target: 20 },  // carga constante
        { duration: '5s',  target: 0  },  // ramp-down
    ],
    thresholds: {
        http_req_duration: ['p(95)<200'],  // RNF001
        http_req_failed:   ['rate<0.01'],  // < 1% de erro
    },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';
const TOKEN = __ENV.TOKEN;

// Lista de IDs de produtos para distribuir a carga
// Ajuste conforme os IDs reais dos seus 100 produtos
const PRODUTO_IDS = Array.from({ length: 100 }, (_, i) => i + 1);

export default function () {
    // Escolhe um produto aleatório da lista
    const produtoId = PRODUTO_IDS[Math.floor(Math.random() * PRODUTO_IDS.length)];

    const payload = JSON.stringify({
        produtoId: produtoId,
        tipo: 'ENTRADA',
        quantidade: 1,
        valorUnitario: 10.00,
        observacao: 'Benchmark de desempenho — ENTRADA',
    });

    const res = http.post(
        `${BASE_URL}/api/v1/movimentacoes`,
        payload,
        {
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
            },
        }
    );

    check(res, {
        'status é 201': (r) => r.status === 201,
        'resposta tem id': (r) => r.json('id') !== undefined,
        'tipo é ENTRADA': (r) => r.json('tipo') === 'ENTRADA',
    });

    sleep(1);
}