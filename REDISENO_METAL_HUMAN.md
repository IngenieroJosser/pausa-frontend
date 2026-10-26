# PAUSA · Rediseño Metal Human

## Concepto

Dirección editorial futurista, **lienzo blanco**, tipografía grafito, metal cinético y pequeños acentos lima. El video decorativo no es un fondo negro: el filtro CSS `invert(1)` convierte el negro original del material audiovisual en blanco y mantiene visibles las líneas metálicas.

## Archivos del rediseño

- `components/intro-screen.tsx`: landing responsive reconstruida; hero inmersivo, vídeo, tarjetas flotantes, mensaje de valor, método, muestra ficticia y tres llamadas a la acción que abren el onboarding real.
- `components/brand.tsx`: nueva identidad PAUSA minimalista para todas las pantallas.
- `app/globals.css`: nueva capa de diseño al final del archivo; mejora visual de landing, onboarding, escenarios y resultados, respetando sus clases/handlers existentes.
- `app/layout.tsx`: título, descripción y `themeColor` blanco.
- `components/pausa-experience.tsx`: recuperación defensiva ante un resultado inválido en `localStorage`.
- `public/metal-human.mp4`: vídeo original optimizado en H.264, 1100 × 822, 24 fps, `faststart`, sin audio y conservando la ruta solicitada (aproximadamente 0,6 MB).
- `public/metal-human.jpg`: imagen original conservada como poster y respaldo para navegadores sin reproducción y para `prefers-reduced-motion`.

## Ejecutar

```bash
npm install
npm run dev:backend  # terminal 1; requiere variables del backend según README.md
npm run dev          # terminal 2
```

También puedes instalar dependencias con pnpm porque se incluye `pnpm-lock.yaml` tal como venía en el proyecto.

Verifica el origen de la API en `lib/learning-api.ts` y las variables de entorno antes de probar el flujo. El onboarding llama a la API existente: no se sustituyó por una demo estática.

## Comprobaciones de entrega

- [x] Ambas rutas (`/metal-human.mp4` y `/metal-human.jpg`) existen y contienen medios válidos.
- [x] Render de referencia del hero en escritorio (1440 × 900) y móvil (390 × 844), comprobado con Chromium y CSS real.
- [x] Parseo TSX de los componentes afectados sin errores sintácticos.
- [x] 6/6 pruebas unitarias locales de `assessment-service` pasan.
- [ ] `next build` / `test:e2e`: ejecutar **después de instalar dependencias**. En el entorno de edición no se pudo completar `npm ci` por bloqueo de red. No se declara build o E2E como aprobado.

## Accesibilidad y performance

- Vídeo silenciado, en bucle, `playsInline`, `preload="metadata"`, imagen de respaldo.
- Si el usuario prefiere movimiento reducido, la versión animada se oculta.
- Botones HTML auténticos y enlaces de ancla, foco visible, navegación accesible mediante teclado.
- Vistas de escritorio y móvil; sin necesidad de registro ni descarga para comenzar.

## Consideraciones

Los casos de la vista previa son **ficticios**; no se usan testimonios inventados, APIs de detección no implementadas ni reclamaciones de efectividad sin medición. El frontend mantiene el contrato con el backend anterior.
