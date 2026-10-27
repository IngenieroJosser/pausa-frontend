# PAUSA — Corrección del arranque de Playwright

## Diagnóstico del log del usuario

- `pnpm exec tsc --noEmit`: no muestra errores.
- `pnpm lint`: termina sin errores ni advertencias.
- `pnpm build`: termina correctamente, incluidas páginas y rutas API.
- `pnpm test:e2e`: falla en las **cinco pruebas antes de entrar al onboarding** porque no encuentra el botón `Comenzar práctica`.

No implica que los cinco flujos estén defectuosos: ninguno alcanza sus pasos principales. Aún no se conocen el estado HTTP, la pantalla ni los errores JS de la ejecución original.

## Cambios implementados

1. `components/pausa-experience.tsx`: en una visita nueva la vista inicial es `intro`, de modo que el CTA se incluye en el HTML renderizado por Next.js; la restauración en segundo plano sustituye temporalmente la vista solo cuando hay una sesión pendiente. Se preserva la recuperación de resultados y sesiones válidas.
2. `playwright.config.ts`: la suite usa un servidor Next.js **propio en el puerto 3109**, sin reutilizar el proceso existente del puerto 3000; espera además el endpoint `/api/v1/health`.
3. `e2e/learning-flow.spec.ts`: encapsula la apertura de la bienvenida y, si falla, informa del estado HTTP, la URL real, el texto renderizado y los errores de ejecución del navegador. La quinta prueba usa también este control.

## Verificaciones efectuadas

- 11 pruebas unitarias del banco/selección adaptativa: **aprobadas**.
- Sintaxis de los tres archivos TS/TSX modificados: **aprobada** por TypeScript `transpileModule`.
- No se pudo ejecutar `pnpm lint`, `pnpm build` o Playwright completos desde este entorno: faltan dependencias instaladas, navegador y conexión a PostgreSQL. La resolución de los E2E debe verificarse en tu Mac.

## Aplicar y ejecutar en macOS

Copia los tres archivos modificados manteniendo las rutas originales. Mantén tu `.env` local fuera del control de versiones. PostgreSQL debe estar encendido y el seed de 135 escenarios ya cargado.

```bash
pnpm exec tsc --noEmit
pnpm lint
pnpm build
pnpm test:e2e
```

Playwright levantará `http://127.0.0.1:3109` y no utilizará tu servidor de desarrollo en `3000`. Si ya tienes algo en el puerto 3109, puedes usar `PAUSA_E2E_PORT=3110 pnpm test:e2e`.

Si aún falla, consulta el mensaje extendido de `openWelcome`, el archivo `error-context.md` y la traza:

```bash
pnpm exec playwright show-trace test-results/RUTA/trace.zip
```

El registro actualizado permitirá saber si hay un 500, un fallo de hidratación, un problema de red o una regresión real de UI.

## Commit

```bash
git add components/pausa-experience.tsx playwright.config.ts e2e/learning-flow.spec.ts
git commit -m "fix(e2e): estabilizar bienvenida y aislar servidor de pruebas"
git push origin main
```
