# PAUSA V4 · UX breve, variable y más agradable

## Objetivo de esta iteración
Reducir la sensación de longitud y hacer el onboarding mucho más intuitivo, agradable y divertido, sin perder el tono serio del producto.

## Cambios principales

### 1) Recorrido más corto y mejor distribuido
La sesión ahora está pensada para sentirse breve:
- selección de tema
- fricción principal
- reacción habitual
- nivel de confianza
- 4 casos rápidos de reconocimiento
- plan personalizado
- práctica principal

En total, la experiencia se comunica como una ruta de **10 a 12 interacciones**.

### 2) Mejora del diseño de preguntas posteriores al tema
Se añadieron nuevas tarjetas tipo premium para:
- `HabitStage`
- `ConfidenceStage`

Estas tarjetas tienen mejor jerarquía, estados de selección claros y una UX más amable.

### 3) Más variedad sin hacerlo extenso
El backend conserva el banco grande de escenarios por tema, pero el onboarding solo muestra una fracción corta.
En calibración ahora se presentan **4 casos rápidos aleatorios** por sesión.

### 4) Copys y ritmo más claros
Se mejoró la narrativa del onboarding para que el usuario entienda que:
- el recorrido será corto,
- no verá siempre lo mismo,
- y la sesión se adapta a su perfil.

## Archivos principales modificados
- `components/onboarding.tsx`
- `app/globals.css`

## Nota técnica
No se modificó la lógica crítica del backend para mantener estabilidad en la evaluación principal. Esta versión prioriza UX, percepción de calidad y claridad del recorrido.
