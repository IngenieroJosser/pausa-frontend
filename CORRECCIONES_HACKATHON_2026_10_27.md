# PAUSA — Correcciones del onboarding y pruebas (27 de octubre de 2026)

## Alcance
Partimos del ZIP `frontend(20261027-000943).zip`. Se preservan Next.js 16, Prisma 7, PostgreSQL, las siete rutas API existentes, los 135 escenarios, la identidad visual y la evaluación del servidor. **No requiere migraciones nuevas.**

## Ajustes implementados

1. **Progreso real en onboarding:** seis etapas coherentes con el recorrido (`objetivo → dificultad → reacción → confianza → reconocimiento → plan`). El indicador muestra 1/6…6/6 y tiene atributos accesibles de progreso.
2. **Sin progreso fingido:** desaparece la pantalla temporizada de 0 a 100 %. Al pulsar «Iniciar práctica interactiva», `PausaExperience` inicia realmente la petición `POST /api/v1/sessions` y muestra una pantalla de carga únicamente hasta la respuesta de la API. Los errores se muestran mediante el componente de reintento ya existente.
3. **Retroceder sin perder respuestas:** objetivo, dificultad, hábito y confianza se preservan al retroceder. Los cuatro casos de reconocimiento se muestrean una sola vez por tema y sus respuestas se mantienen al volver a la etapa. Si se cambia el tema, se genera una calibración nueva apropiada para ese tema.
4. **Corrección antes de terminar:** en las preguntas de calibración aparece el control «Corregir la respuesta anterior», que permite volver a elegir antes de cerrar el bloque. Al terminar se muestra el número de señales identificadas y el resumen pedagógico.
5. **Dos fallos React Hooks de ESLint:** el gráfico ya reinicia su escena directamente en los eventos o intervalo, y la restauración del estado inicial se programa fuera del cuerpo síncrono del efecto. Se evita desactivar reglas de ESLint para ocultar el error.
6. **Directiva ESLint sobrante:** eliminada en `lib/server/prisma.ts`.
7. **Pruebas:** navegación inicial de Playwright espera `domcontentloaded`, evitando bloquear el flujo por medios decorativos como el vídeo del hero; la suite incluye un caso adicional de persistencia de selección y corrección durante la calibración. Se revisó el import del test unitario con Node.js y la opción `allowImportingTsExtensions` bajo `noEmit`.
8. **Transición accesible:** carga con estado real y etiquetas `role=status`, `aria-live` y estilo `prefers-reduced-motion`.

## Validaciones efectuadas en este entorno

- `node --experimental-strip-types --test tests/*.test.ts`: **11/11 pruebas unitarias aprobadas**.
- Análisis sintáctico de **58 archivos TS/TSX** con TypeScript: **0 errores sintácticos**.
- No se ejecutaron ESLint, `pnpm build` ni pruebas E2E completas aquí: el entorno de trabajo no tiene las dependencias `node_modules`, el navegador Playwright ni conexión a tu PostgreSQL local. Debes ejecutar estos comandos en tu Mac. No declaramos las pruebas E2E como aprobadas.

## Cómo integrar y verificar en macOS

Copia el proyecto corregido o reemplaza los archivos modificados. Mantén tu `.env` con `DATABASE_URL` (nunca lo subas a Git). Desde la raíz:

```bash
pnpm install --frozen-lockfile
pnpm db:generate
pnpm db:deploy
pnpm db:seed
pnpm exec playwright install chromium
pnpm exec tsc --noEmit
pnpm lint
pnpm build
pnpm test:e2e
```

La ruta `GET /api/v1/health` requiere PostgreSQL accesible y los 135 casos publicados. Antes de Playwright prueba `http://127.0.0.1:3000/api/v1/health` cuando el servidor esté levantado y verifica un código 200. **Cierra servidores Next.js antiguos** que ocupen el puerto 3000, ya que Playwright puede reutilizarlos y ejecutar una versión anterior del frontend.

Si un E2E falla, inspecciona la traza real:

```bash
pnpm exec playwright show-report
# o abre el archivo trace.zip generado en test-results con:
pnpm exec playwright show-trace RUTA/AL/trace.zip
```

Comprueba los errores de consola del navegador y el contenido del DOM al momento del fallo. Si la primera pantalla no avanza de «Recuperando tu práctica», inspecciona las trazas de hidratación y la respuesta de las rutas API.

## Conventional commit sugerido

```bash
git add -A
git commit -m "fix(onboarding): corregir progreso, preservar respuestas y estabilizar pruebas"
git push origin main
```
