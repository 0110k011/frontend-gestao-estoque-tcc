// benchmark/busca-produtos.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '10s', target: 50 },  // ramp-up
        { duration: '30s', target: 50 },  // carga constante
        { duration: '5s',  target: 0  },  // ramp-down
    ],
    thresholds: {
        http_req_duration: ['p(95)<200'],  // RNF001
        http_req_failed:   ['rate<0.01'],  // < 1% de erro
    },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';
const TOKEN = __ENV.TOKEN;

// Termos de busca que retornam resultados reais na base de 100 produtos
const TERMOS_BUSCA = [
    'Coca',
    'Arroz',
    'Água',
    'Café',
    'Mouse',
    'Camiseta',
    'Ração',
    'Óleo',
    'Sabão',
    'Filtro',
];

export default function () {
    // Escolhe um termo aleatório
    const termo = TERMOS_BUSCA[Math.floor(Math.random() * TERMOS_BUSCA.length)];

    const res = http.get(
        `${BASE_URL}/api/v1/produtos/buscar?nome=${encodeURIComponent(termo)}&page=0&size=20`,
        {
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
            },
        }
    );

    check(res, {
        'status é 200': (r) => r.status === 200,
        'resposta tem content': (r) => r.json('content') !== undefined,
    });

    sleep(1);
}