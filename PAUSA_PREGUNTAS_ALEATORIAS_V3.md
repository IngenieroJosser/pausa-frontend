# PAUSA V3 — Laboratorio de decisiones

## Alcance

Rediseño del onboarding de reconocimiento y del módulo de decisiones posterior a la selección del tema. Conserva la identidad blanca de Metal Human V2, los medios `public/metal-human.mp4` y `public/metal-human.jpg`, la persistencia en SQLite y el flujo de tres decisiones evaluadas.

### Banco de casos

Archivo de autoría y reglas (servidor): `shared/scenario-bank.json`. Archivo sin claves de respuesta (cliente): `shared/public-scenario-bank.json`.

| Tema | Diagnóstico | Práctica | Transferencia | Total |
| --- | ---: | ---: | ---: | ---: |
| Empleo | 15 | 15 | 15 | 45 |
| Dinero | 15 | 15 | 15 | 45 |
| Identidad y datos | 15 | 15 | 15 | 45 |
| **Total** | **45** | **45** | **45** | **135** |

Estos son **135 casos únicos** basados en **45 patrones editoriales** adaptados a tres contextos diferentes. Cada caso contiene remitente, comunicación simulada, tres alternativas, una regla de evaluación del servidor y retroalimentación pedagógica. Incluyen casos con señales de riesgo y casos sin señales críticas evidentes, para evitar que la persona aprenda a rechazar indiscriminadamente.

### Selección

1. En el reconocimiento inicial se muestran **tres casos elegidos aleatoriamente** dentro del tema, dos de riesgo y uno sin señal crítica, en orden variable. Son breves y no se guardan como evaluación final.
2. El backend selecciona un diagnóstico entre los 15 del tema elegido. Para cada nueva sesión se usa la identidad aleatoria de sesión (UUID) y un hash SHA-256. La elección es distinta en general entre sesiones pero **reproducible dentro de una misma sesión**.
3. La práctica prioriza la señal de riesgo ignorada en el diagnóstico. Si la respuesta fue acertada, prioriza la fricción elegida en onboarding.
4. La transferencia selecciona un caso de otro patrón y preferiblemente de una señal distinta a la práctica.
5. El backend acepta solo el escenario asignado y una alternativa existente; las reglas correctas no dependen de campos enviados por el cliente. Se conserva la idempotencia de decisiones.

## Archivos principales

- `components/onboarding.tsx`: calibración variable y nuevo bloque de progreso visual.
- `components/scenario-step.tsx`: interfaz editorial y tarjetas de decisión nuevas, accesibilidad mediante teclado.
- `components/feedback-step.tsx`: consecuencias y explicación genéricas y coherentes con el caso.
- `components/result-screen.tsx`: desglose del rendimiento y habilidades basado en los escenarios realmente vistos.
- `components/pausa-experience.tsx`: reinicio del estado de cada escenario.
- `app/globals.css`: estilos responsivos V3; mantiene el fondo blanco.
- `backend/catalog.mjs` y `backend/assessment-service.mjs`: catálogo y selección adaptativa.
- `backend/*.test.mjs`: contratos y pruebas del motor actualizados.
- `e2e/learning-flow.spec.ts`: flujo E2E ajustado para IDs aleatorios.

## Cómo correr

En la raíz del proyecto:

```bash
npm ci
npm run dev:backend
```

En otra terminal:

```bash
npm run dev
```

Visita `http://localhost:3000` (backend `http://127.0.0.1:3101`). Si se despliega en Vercel + Railway, **actualiza backend y frontend** porque ambos deben tener el mismo banco y contrato de escenarios. En Vercel apunta `NEXT_PUBLIC_API_URL` al backend y mantén la configuración CORS de producción.

## Pruebas

```bash
npm run test:backend
npm run build
npm run test:e2e
```

Validado en entorno de trabajo: 8 pruebas del servicio de evaluación aprobadas; 450 sesiones completas simuladas, con los 45 casos de cada tema observados; análisis sintáctico TSX y CSS correcto.

**Pendiente por limitación del entorno:** instalar dependencias de NPM para ejecutar pruebas HTTP, build real de Next.js y E2E en navegador. No hay afirmación de que estas pruebas completas hayan pasado.

## Criterios de producto

- **45 casos por tema** no significa que la persona deba responder 45 en una sola visita: se presenta una experiencia corta de 3 reconocimientos + 3 decisiones evaluadas y el banco permite repetir sin quedar atado a un único guion.
- Todos los mensajes y remitentes son ficticios: no se incluyen enlaces peligrosos ni solicitudes reales de datos de salud o finanzas.
- La puntuación (0 a 3) representa decisiones en esta sesión, no una probabilidad clínica o estadística de caer en fraudes.
- La experiencia de onboarding es ilustrativa y el resultado final se basa en decisiones validadas por servidor.
