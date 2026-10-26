# PAUSA — Rediseño de preguntas del onboarding

## Alcance

Se rediseñaron visualmente las dos primeras etapas sin modificar la lógica de negocio ni la estructura de los resultados:

1. **¿Qué quieres proteger hoy?** — selección de `empleo`, `dinero` o `datos`.
2. **¿Qué te hace difícil detenerte?** — selección de `urgencia`, `marca`, `miedo` o `canal`.

## Cambios principales

- Cabeceras editoriales con numeración, jerarquía clara y acento verde.
- Tarjetas grandes con ilustraciones CSS/DOM sin nuevas dependencias ni solicitudes de recursos.
- Estados de selección, hover y foco, con `aria-pressed` y agrupación semántica.
- Panel inferior que refleja la elección y explica su impacto sobre la práctica.
- Responsive: tarjetas horizontales compactas en móvil para las metas, una columna para los puntos ciegos.
- Compatibilidad con navegación mediante teclado y con `prefers-reduced-motion`.
- Se conservan los textos accesibles originales de las acciones Continuar, para mantener las pruebas E2E existentes.
- Sin cambios en `onComplete`, persistencia, backend, escenarios, resultados ni video de fondo.

## Archivos modificados

- `components/onboarding.tsx`
- `app/globals.css`

## Verificaciones realizadas

- Sintaxis TSX revisada mediante el parser de TypeScript: sin errores.
- Archivo CSS analizado mediante PostCSS: sin errores.
- Previews de composición comprobadas con Chromium (1440 px y 430 px), sin desbordamiento horizontal.
- Los tests unitarios del servicio de evaluación completaron 6 casos. Las pruebas HTTP y el build no se pudieron ejecutar aquí porque las dependencias del entorno están incompletas (`node_modules/next` y `node_modules/zod` vacíos).

## Para validar en tu equipo

```bash
npm install
npm run build
npm run test:backend
npm run dev
```

Comprueba en un navegador `Comenzar práctica → ¿Qué quieres proteger hoy? → ¿Qué te hace difícil detenerte? → situaciones simuladas` y selecciona varias opciones.
