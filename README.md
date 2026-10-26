# PAUSA · Fullstack Next.js 16 + Prisma 7 + PostgreSQL

**Sin backend separado.** La misma aplicación Next.js aloja el frontend, la API REST, el motor de aprendizaje y el acceso a PostgreSQL con Prisma.

## 1. Requisitos

- Node.js 22.18+ o 24 LTS compatible con Next.js/Prisma 7.
- pnpm 10 (fijado en `package.json`).
- PostgreSQL accesible mediante `DATABASE_URL`.
- Base de datos creada previamente. No se incluyen credenciales en el proyecto.

## 2. Primera instalación

```bash
pnpm install --frozen-lockfile
cp .env.example .env
# Editar .env con la URL real de PostgreSQL
pnpm db:generate
pnpm db:deploy
pnpm db:seed
pnpm dev
```

Abrir `http://localhost:3000` y comprobar `http://localhost:3000/api/v1/health`.
La respuesta debe incluir `status: "ok"` y `publishedScenarios: 135` (o más si añades nuevos escenarios).

**Importante:** `db:deploy` aplica las migraciones versionadas; `db:seed` publica los 135 casos usando UPSERT, sin borrar las sesiones ni las decisiones. Si ya aplicaste la migración inicial, Prisma ejecutará únicamente las pendientes.

### Variables de entorno

| Variable | Uso | ¿Exponer al navegador? |
| --- | --- | --- |
| `DATABASE_URL` | conexión PostgreSQL del servidor vía `@prisma/adapter-pg` | **Nunca** |
| `DIRECT_URL` | opcional; conexión directa para Prisma Migrate cuando `DATABASE_URL` usa pooler | **Nunca** |

**No configures `NEXT_PUBLIC_API_URL`:** ya no se necesita. El frontend utiliza rutas relativas `/api/v1` del mismo dominio.

## 3. Rutas REST

Todas las rutas usan `runtime = "nodejs"`, respuesta JSON y `Cache-Control: no-store`.

| Método | Ruta | Operación | Token |
| --- | --- | --- | --- |
| GET | `/api/v1/health` | disponibilidad de PostgreSQL/catálogo | no |
| POST | `/api/v1/sessions` | crear sesión y asignar diagnóstico | no |
| GET | `/api/v1/sessions/:id` | recuperar estado y decisiones | sí |
| POST | `/api/v1/sessions/:id/decisions` | evaluar y avanzar atómicamente | sí |
| POST | `/api/v1/sessions/:id/interactions` | registrar eventos idempotentes | sí |
| POST | `/api/v1/sessions/:id/complete` | generar resultado definitivo | sí |
| GET | `/api/v1/sessions/:id/results` | obtener informe y competencias | sí |

El token anónimo se entrega **una sola vez** al crear la sesión. La API almacena únicamente su hash SHA-256. Las operaciones posteriores requieren `Authorization: Bearer <accessToken>`. La sesión del navegador se guarda en `sessionStorage` para poder reanudarse al recargar; el último resultado resumido se guarda en `localStorage`.

### Ejemplo de creación

```bash
curl -i -X POST http://localhost:3000/api/v1/sessions \
  -H 'Content-Type: application/json' \
  -d '{"goal":"empleo","friction":"urgencia","habit":"verifico","confidence":"media"}'
```

Devuelve `id`, `accessToken` y `nextScenario` con un identificador de la forma `empleo-xx-d`.

### Ejemplo de decisión

```json
{
  "requestId": "d6e387a9-a81c-4ff4-a339-ea5da393b4dd",
  "scenarioId": "empleo-01-d",
  "choiceId": "verify",
  "elapsedMs": 4500
}
```

**Los IDs anteriores son ilustrativos:** usa los valores devueltos al crear la sesión y una opción del escenario asignado. Los IDs de respuesta correcta y puntuación no se aceptan desde el navegador. Reenviar el mismo `requestId`/escenario/opción devuelve el resultado confirmado sin insertar otra decisión, aunque cambie el tiempo de reintento. Cambiar opción con el mismo `requestId` devuelve `409`.

## 4. Motor de evaluación

- Banco de **135 escenarios**: 45 por tema (empleo, dinero e identidad); 15 por etapa.
- Ruta breve: 4 preguntas de perfil, 4 de reconocimiento y **3 decisiones evaluadas** (11 respuestas aproximadas en total). No se muestran los 135 casos en una misma sesión.
- Selección estable por sesión, pero variable entre sesiones y con comprobación de familias previas.
- La práctica refuerza la señal errónea del diagnóstico o la fricción declarada cuando el diagnóstico fue correcto.
- La transferencia usa otro patrón de riesgo cuando existen alternativas.
- Prisma/PostgreSQL guarda asignaciones, decisiones, competencias, eventos e informes.
- Transacciones `Serializable`, control de concurrencia, idempotencia por UUID y detección de respuestas fuera de secuencia.
- El Inspector no muestra pistas durante decisiones evaluadas; las explicaciones aparecen en la retroalimentación.
- El reporte de 3 decisiones es una **medida de desempeño en simulaciones**; no una predicción clínica ni una prueba de eficacia concluyente.

## 5. Validaciones

```bash
pnpm test:backend             # 11 pruebas de selección y catálogo sin DB
pnpm lint                     # ESLint 9 y reglas Next.js
pnpm build                    # prisma generate + build de producción
# Con PostgreSQL ya migrado, catálogo sembrado y servidor levantado:
node scripts/smoke-api.mjs
# Opcional, con Playwright Chromium instalado:
pnpm exec playwright install chromium
pnpm test:e2e
```

La prueba HTTP comprueba el healthcheck, seguridad por token, selección, tres decisiones, idempotencia, conflicto, cierre y resultados. La prueba E2E recorre la UX y requiere DB.

## 6. Vercel

1. Importa el repositorio como un único proyecto Next.js.
2. Configura `DATABASE_URL` en las variables **server-side** de Vercel. Si tu proveedor usa pooler, configura opcionalmente `DIRECT_URL` (directa) para migraciones ejecutadas desde un entorno de administración/CI.
3. **Una vez por despliegue con cambios de esquema**, ejecuta `pnpm db:deploy` desde un entorno seguro con la misma base de datos. No ejecutes migraciones paralelas en los builds de preview.
4. **En la primera instalación**, ejecuta `pnpm db:seed`; repite después de actualizar el catálogo.
5. Vercel utiliza `pnpm build` (incluye `prisma generate`).
6. Comprueba `/api/v1/health` y ejecuta `BASE_URL=https://tu-dominio.vercel.app node scripts/smoke-api.mjs`.

Si `DATABASE_URL` apunta a una dirección privada no accesible desde Vercel, debes usar el host público y un canal TLS/pooled autorizado. Los datos SQLite anteriores no se importan automáticamente: este sistema crea sesiones nuevas en PostgreSQL.

## 7. Seguridad operativa

- Zod valida las entradas y limita el tamaño del cuerpo HTTP.
- Los tokens no se registran y los errores SQL no se devuelven a los clientes.
- Solo se envía al navegador el **catálogo público**, sin `correctChoiceId`.
- Los escenarios evaluados se confirman exclusivamente en PostgreSQL.
- Hay un rate limit local **best-effort** por instancia; en producción con múltiples instancias agrega Vercel WAF o rate limit distribuido (Redis/Upstash).
- Usa credenciales DB mínimas, SSL, backups, conexiones agrupadas y rotación de secretos.
- Establece una política de retención para los datos anónimos y programa `pnpm db:cleanup` si decides aplicar la limpieza de 30 días incluida.
- No hagas públicas las rutas de resultados sin autenticación del token.

## 8. Organización

```text
app/api/v1/                Route Handlers de Next.js
lib/server/               motor, acceso Prisma, validación y errores
components/               interfaz y recorrido
prisma/schema.prisma      modelos PostgreSQL existentes (extendidos)
prisma/migrations/        migraciones versionadas
prisma/seed.ts            catálogo idempotente
shared/                   banco editorial privado + vista pública sin clave
scripts/smoke-api.mjs     prueba de integración HTTP
scripts/seed-runner.mjs   ejecutor TS via jiti
```

## Alcance pendiente de validar

Este proyecto entrega el código y pruebas unitarias. **Un build real, migraciones en tu PostgreSQL y pruebas E2E de Vercel no pueden darse por aprobados sin instalar paquetes y conectar la base de datos real.** Esos pasos son obligatorios antes de entregar la hackathon.
