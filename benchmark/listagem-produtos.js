// benchmark/listagem-produtos.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '10s', target: 50 },  // ramp-up
        { duration: '30s', target: 50 },  // carga constante
        { duration: '5s',  target: 0  },  // ramp-down
    ],
    thresholds: {
        http_req_duration: ['p(95)<200'],  // RNF001: 95% < 200 ms
        http_req_failed:   ['rate<0.01'],  // < 1% de erro
    },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';
const TOKEN = __ENV.TOKEN;

export default function () {
    const res = http.get(`${BASE_URL}/api/v1/produtos?page=0&size=20`, {
        headers: {
            'Authorization': `Bearer ${TOKEN}`,
            'Content-Type': 'application/json',
        },
    });

    check(res, {
        'status é 200': (r) => r.status === 200,
        'resposta tem produtos': (r) => r.json('content') !== undefined,
    });

    sleep(1);
}