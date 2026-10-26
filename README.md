# PAUSA

Ver [PAUSA_PREGUNTAS_ALEATORIAS_V3.md](PAUSA_PREGUNTAS_ALEATORIAS_V3.md) para la ampliación a 135 escenarios (45 por tema), el rediseño y la validación.

MVP educativo para practicar decisiones seguras ante posibles estafas digitales.

## Ejecutar

```bash
npm install
npm run dev
npm run dev:backend
```

Abre `http://localhost:3000`. La API pedagógica escucha en `http://127.0.0.1:3101`.

## Flujo del MVP

1. Diagnóstico variable entre 45 casos del tema seleccionado (empleo, dinero o identidad).
2. Retroalimentación según la decisión y la señal del caso, con práctica adaptativa.
3. Práctica adaptada al tipo de error.
4. Prueba de transferencia en un contexto nuevo.
5. Resultado persistido localmente en el navegador.

La lógica de evaluación es determinista y se ejecuta exclusivamente en el backend. El frontend conserva el contenido visual de los escenarios, pero no recibe las respuestas correctas antes de decidir.

## API pedagógica

- `POST /api/v1/sessions`
- `GET /api/v1/sessions/:id`
- `GET /api/v1/scenarios/:id`
- `POST /api/v1/sessions/:id/decisions`
- `POST /api/v1/sessions/:id/interactions`
- `GET /api/v1/sessions/:id/next-scenario`
- `POST /api/v1/sessions/:id/complete`
- `GET /api/v1/sessions/:id/results`

Al crear una sesión, la API devuelve una credencial anónima opaca. Las operaciones de esa sesión requieren `Authorization: Bearer <credencial>`; el identificador por sí solo no concede acceso. Los datos locales se almacenan en `backend/data/pausa.sqlite`, ruta excluida de Git.

## Validación

```bash
npm run test:backend
npm run build
npm run test:e2e
```

La prueba E2E utiliza Chrome instalado localmente y cubre onboarding, diagnóstico, práctica adaptativa, transferencia, resultado persistido y recuperación de una desconexión.
