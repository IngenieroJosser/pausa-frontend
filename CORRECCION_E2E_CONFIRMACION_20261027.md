# PAUSA — Corrección Playwright de confirmación de decisión

## Diagnóstico
Los tres tests fallidos esperaban un botón cuyo texto accesible era `Confirmar decisión`, pero la interfaz actual en `components/scenario-step.tsx` muestra `Confirmar y descubrir el resultado`. Por lo tanto, el error era un selector desactualizado en las pruebas, no un fallo demostrado en las transacciones de la API.

## Cambios
- `e2e/learning-flow.spec.ts`: helper `confirmDecisionButton` con texto real de la UI.
- Verificación explícita de `aria-checked=true` después de seleccionar una respuesta.
- Verificación de botón habilitado antes de hacer clic.
- La prueba de reintento usa el mismo helper.
- No se modificó lógica de producción ni base de datos.

## Pruebas
- Ejecutadas en el entorno de edición: `node --experimental-strip-types --test tests/*.test.ts` — 11/11 aprobadas.
- Pendientes en tu máquina, con PostgreSQL activo: `pnpm exec tsc --noEmit && pnpm lint && pnpm build && pnpm test:e2e`.

Si otro paso falla, inspecciona la traza:
`pnpm exec playwright show-trace <ruta-al-trace.zip>`.
