# Página 404 PAUSA

Se añadió `app/not-found.tsx` siguiendo la convención de Next.js App Router. El diseño reutiliza `Brand` y las imágenes existentes de PAUSA.

- Página responsive y accesible, con estado 404, una acción de retorno a `/`, animación respetuosa con `prefers-reduced-motion` y metadata sin indexación.
- Las reglas están al final de `app/globals.css` bajo el prefijo `nf-` para evitar afectar las demás pantallas.
- No requiere instalar dependencias adicionales ni cambiar el backend.
- Para probarla en desarrollo: `pnpm dev` y visitar, por ejemplo, `/ruta-que-no-existe`.
- Para validar producción: `pnpm build` y `pnpm start`.
