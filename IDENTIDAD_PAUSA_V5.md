# PAUSA V5 · Nueva identidad visual (logo y favicon)

## Concepto
Un signo de **PAUSA** formado por dos barras verticales verde lima dentro de un contenedor grafito con esquinas redondeadas. La nueva identidad mantiene el fondo blanco del sitio, el video Metal Human y la tipografía editorial existente.

## Archivos modificados
- `components/brand.tsx` — isotipo consistente en landing, onboarding, práctica, resultados y error; nombre PAUSA + descriptor «Piensa. Verifica. Decide.»
- `app/globals.css` — dimensiones, espaciado, microinteracción suave y adaptación móvil del logo.
- `app/layout.tsx` — favicon SVG/PNG, icono Apple Touch y webmanifest.
- `public/favicon.svg` — favicon actualizado y coherente con el logo.

## Assets nuevos
- `public/logo-mark.svg` — isotipo vectorial fuente.
- `public/logo-horizontal.svg` — logotipo completo exportable (contornos de texto vectorizados).
- `public/favicon.ico` y `public/favicon-32.png` — compatibilidad de navegadores.
- `public/apple-touch-icon.png` — icono 180 × 180 px para dispositivos Apple.
- `public/icon-192.png`, `public/icon-512.png`, `public/site.webmanifest` — metadatos de icono para dispositivos.
- `public/logo-mark-512.png` — vista previa del isotipo en alta resolución.

## Validaciones realizadas
- XML/SVG bien formado.
- Archivos PNG/ICO legibles, dimensiones correctas.
- Referencias a recursos de `app/layout.tsx` resueltas.
- Diseño de logo visualmente revisado en versión horizontal.

## Pendiente en el entorno de destino
Ejecutar `npm install`, `npm run build` y las pruebas E2E con las dependencias reales del proyecto instaladas.

## Importante
No se modificó la evaluación del backend, ni los bancos de preguntas, ni los flujos de navegación.
