# Component Map: H5 - Generar y ver el resultado del VTON

## Resumen de la historia
Como usuaria, quiero ver una imagen generada de cómo me quedaría puesta la prenda que subí, para decidir si me sirve sin tener que probármela físicamente.

**Criterios de aceptación funcionales**:
- Una vez validadas ambas fotos (H3, H4), el sistema procesa y genera una imagen mostrando la prenda puesta sobre la persona de la foto propia.
- El resultado se muestra a la usuaria en pantalla completa o destacado como elemento principal de la pantalla de resultado.

**Criterios de experiencia**:
- Mientras se genera el resultado, se muestra un estado de espera que transmite calma ("estamos preparando tu look"), no una barra de progreso técnica o ansiógena.
- Si el tiempo de procesamiento se extiende, el estado de espera lo sostiene sin dar sensación de que algo se rompió.
- La presentación del resultado es el momento de mayor cuidado visual del flujo: es "el momento mágico" que el MVP existe para validar.

**Casos borde**:
- Falla técnica en la generación (no relacionada con calidad de foto, sino error de procesamiento): comportamiento no especificado por el PRD.
- Usuaria cierra o minimiza la app mientras se genera el resultado.
- Conexión se pierde durante el procesamiento.

**Dependencias**: depende de H4. **Prioridad**: alta (F1, corazón funcional del MVP).

## Pantallas involucradas
- **Estado de espera / generación**: implementado como `ProcessingModal` (`src/components/ProcessingModal.tsx`), overlay a pantalla completa sobre el paso `processing` de `src/App.tsx`. Corresponde al tramo "loader de marca" del template de sección 8.4 "Template de flujo de prueba virtual (subida de prenda → **loader de marca** → resultado)".
- **Pantalla de resultado**: implementada como `Step3Result` (`src/components/Step3Result.tsx`), paso `step3_result` de `App.tsx`. Corresponde a las pantallas de inventario (sección 8.5) "Tu primer resultado (momento hero, máxima expresividad)" y "Resultado de prueba — comparar y guardar".
- **Comparativa antes/después**: implementada como `CompareModal` (`src/components/CompareModal.tsx`), invocada desde `Step3Result` al tocar el botón de expandir/comparar. Es la vista que en el organismo "Visor de resultado VTON" (sección 8.3) se describe como "slider antes/después".

No hay historial ni router: los tres son componentes reales del repo ya construidos, no gaps de implementación.

## Componentes del DS a usar
- `ProcessingModal` (organismo, equivalente a "loader de marca" dentro del Template de flujo de prueba virtual) — estado de espera de la generación. Existe en el código.
- `Step3Result` (organismo/template — funciona como el "Visor de resultado VTON" de la sección 8.3 más el header de pantalla) — presentación del resultado. Existe en el código.
- `CompareModal` (parte del organismo "Visor de resultado VTON": "slider antes/después") — comparación foto original vs. resultado. Existe en el código.
- Botón de ícono circular (átomo) — usado en `Step3Result` para expandir/comparar (`topRightButton`), compartir y favorito (`actionCircleButton`), y en `CompareModal` para cerrar (`closeButton`). Implementado inline en cada componente, no como átomo compartido separado (ver "Riesgos").
- Spinner/loader de marca (átomo, sección 6 de `DESIGN.md`) — el ícono de percha (SVG) dentro de `ProcessingModal.hangerWrapper`.
- Toast/snackbar (organismo, sección 8.3) — el bloque `shareBanner` en `Step3Result` cumple la función de confirmación temporal ("¡Enlace del look copiado al portapapeles!"), aunque su implementación visual no sigue el spec exacto del DS (ver "Riesgos").

## Componentes a extender
- `ProcessingModal` — el DS (sección 6) especifica que el loader debe ser "una animación sutil tipo 'percha balanceándose' o barra de progreso lineal en Ciruela suave". La implementación actual ya trae la barra lineal, pero en Ciruela plena (`#7A4655`) en vez de Ciruela suave (`#C6A2AC`), y el ícono de percha es estático (sin balanceo). Habría que extender la animación del ícono (swing sutil, `ease-out`, ~200-280ms, con alternativa estática para *reduced motion* según sección 6) y ajustar el color de la barra a Ciruela suave.
- `Step3Result` — el header de pantalla (`titleWrapper`/`mainTitle`) necesita revisarse contra el token Display/H1 de la sección 2, que asigna explícitamente la serifa editorial al "momento del resultado VTON". Ver detalle en "Riesgos": actualmente usa `fontFamily: 'sans-serif'`.
- `Step3Result` (`heroCard`) — no implementa el patrón de "halo o borde sutil Ciruela alrededor de la imagen resultado" ni la sombra nivel 3 que la sección 5 y 3.3 del DS reservan específicamente para el resultado VTON en pantalla completa; habría que extender el estilo del contenedor hero para incorporar ambos.
- `Step3Result` / `CompareModal` — no existe una variante de error para cuando la generación falla (caso borde explícito de H5: "falla técnica en la generación"). Habría que extender `ProcessingModal` (o crear un estado hermano) con una variante de error que reutilice el mismo layout centrado y ofrezca reintentar, en el mismo tono calmo que el resto del flujo.

## Gaps (componentes que no existen en el DS ni en el repo)
- **Estado de error de generación** — el inventario del DS no define un componente específico de "error de procesamiento" (solo cubre indicador de calidad de foto, que es un error de validación de input, no de fallo de servicio). Es un gap real: ni `DESIGN.md` ni el repo tienen algo para el caso borde de H5 "falla técnica en la generación".
  - **Resolución temporal sugerida**: reutilizar el layout de `ProcessingModal` (mismo overlay, mismo `contentBox` centrado) reemplazando el ícono de percha y el texto de estado por un mensaje breve y calmo (tono consistente con sección 0, "Sutileza"/"Elegancia cotidiana"), con un botón primario de "Reintentar" (átomo botón primario ya definido) y un botón terciario para volver atrás. No requiere un componente nuevo, solo una variante de contenido del mismo contenedor.
- **Badge de estado "VTON ENGINE"** (`badgePill` en `ProcessingModal`) — no corresponde exactamente a ningún átomo/molécula del inventario (no es badge de privacidad ni badge premium, que tienen semántica específica de ícono+significado).
  - **Resolución temporal sugerida**: tratarlo como una variante del átomo "chip de filtro" en su versión inactiva (pill, fondo Bruma), sin necesidad de definir un átomo nuevo — es decorativo, no funcional.

## Tokens relevantes
- **Colores**: Ciruela (`#7A4655`) para el ícono de marca del loader y el acento del resultado; Ciruela suave (`#C6A2AC`) recomendada para la barra de progreso (no aplicada actualmente); Salvia (`#8C9B7E`) para el badge de confirmación "prenda cargada" (`garmentCheckBadge`) y para el ícono de éxito del toast de compartir; Lino/Bruma como fondos de superficie del overlay y de las cards; Grafito como texto principal; Piedra para texto secundario/metadata.
- **Spacing**: margen lateral de pantalla 20px (`Step3Result.container.paddingHorizontal: 20`, coherente con la sección 3.1); escala 4·8·12·16·24 presente en gaps y paddings de ambos componentes.
- **Tipografía**: Display/H1 serifa editorial corresponde al título de la pantalla de resultado ("¡Tu primer look está listo!") según sección 2 — actualmente no aplicado (ver Riesgos); Body M / Caption (sans UI) para la descripción de estilo, metadata del garment chip y texto del loader.
- **Radios / sombra**: `radius-lg` (20px) correctamente aplicado en `heroCard` (Step3Result) y en `sliderContainer`/`sideCard` (CompareModal), consistente con "Cards de prenda/outfit" y el radio de imagen resultado. Sombra nivel 3 (`0px 12px 32px rgba(43,36,32,0.16)`), reservada explícitamente por el DS para "resultado VTON en pantalla completa, momento hero", no está aplicada como `boxShadow` en ninguno de los tres componentes — se usa borde de 1px en su lugar (ver Riesgos).
- **Movimiento**: sección 6 — "revelación del resultado VTON (fade + leve escala desde 0.96 a 1.0)" es el único momento coreografiado documentado para este flujo. No se verificó una transición de entrada explícita en `Step3Result` al montar (no hay animación de fade/scale en el código leído); es candidato a extensión si no existe ya a nivel de `App.tsx`/CSS global (no confirmado, fuera del alcance de los archivos revisados).

## Patrones de interacción
- **Estado de espera calmo**: resuelto por `ProcessingModal` con badge + texto de etapa + barra lineal, en línea con la indicación de H5 de evitar ansiedad — aunque el porcentaje numérico explícito (`progressValue`, ej. "24%") tensiona contra el criterio de experiencia de H5 ("no una barra de progreso técnica"); el DS no prohíbe mostrar el número, pero es un punto a revisar con PO/diseño dado que el criterio de la historia lo pide explícitamente.
- **Comparación antes/después**: resuelta por `CompareModal` con slider interactivo (`<input type="range">` invisible superpuesto) y modo alternativo "lado a lado" — corresponde al patrón "slider antes/después" del organismo "Visor de resultado VTON" (sección 8.3).
- **Confirmación temporal ("compartido")**: resuelta por el bloque `shareBanner` en `Step3Result`, pero visualmente no sigue el spec del Toast/snackbar de la sección 8.3 (fondo Grafito/texto Lino, aparición discreta desde abajo) — está implementado como una card estática con fondo claro (`#FAF7F2`) y borde Salvia, en el flujo normal del documento, no como overlay flotante. Ver Riesgos.
- **Modal centrado vs. bottom sheet**: `CompareModal` es un modal centrado clásico (overlay + card centrada, sin *handle* de bottom sheet). Es una excepción justificable porque está directamente ligado al "momento hero" del resultado VTON (la única excepción documentada al patrón bottom sheet), pero no es literalmente full-bleed/pantalla completa como pide la sección 5 para ese momento — queda como card con padding y bordes redondeados de 24px. Ver Riesgos.

## Componentes transversales de esta historia
- `ProcessingModal`, `Step3Result` y `CompareModal` comparten la paleta Ciruela/Salvia/Lino/Bruma y el radio `radius-lg` para contenedores de imagen — son los tres componentes que materializan completamente H5 de punta a punta (espera → resultado → comparación).
- El ícono de marca (percha SVG) aparece en dos lugares distintos con dibujos ligeramente diferentes (`ProcessingModal` y el `hangerBadge` de la card de conversión en `Step3Result`) — no es el mismo asset reutilizado, sino dos SVG inline distintos.

## Riesgos / inconsistencias con el DS detectadas
- **Serifa editorial ausente en el "momento" que la sección 2 se la reserva explícitamente**: `Step3Result.mainTitle` usa `fontFamily: 'sans-serif'` para el título de la pantalla de resultado ("¡Tu primer look está listo!"), pero la sección 2 del DS asigna la serifa editorial (Display/H1) justamente a "el momento del resultado VTON". El historial de git confirma que esto fue un cambio deliberado (`e9aeb64 style(ui): switch screen titles from serif to sans-serif`), por lo que no es un descuido sino una decisión de producto que contradice el DS documentado — requiere alineación explícita entre `DESIGN.md` y el equipo antes de dar esta pantalla por conforme al sistema.
- **Sombra nivel 3 no aplicada**: la sección 3.3 reserva la sombra más fuerte del sistema (`0px 12px 32px rgba(43,36,32,0.16)`) específicamente para "resultado VTON en pantalla completa, momento hero", pero ni `heroCard` (Step3Result) ni `modalCard` (CompareModal) implementan `boxShadow` — usan bordes de 1px en su lugar. Es un patrón repetido en los tres componentes revisados, no solo en H5.
- **Barra de progreso en Ciruela plena, no Ciruela suave**: la sección 6 pide "barra de progreso lineal en Ciruela suave" para loaders; `ProcessingModal.progressBarFill` usa Ciruela (`#7A4655`) sin atenuar.
- **Ícono de marca sin animación**: la sección 6 ofrece como alternativa al progreso lineal una "percha balanceándose"; el ícono de percha en `ProcessingModal` está etiquetado como "Animated" en un comentario pero el SVG no tiene animación aplicada en el código.
- **Porcentaje numérico visible durante la espera**: tensiona contra el criterio de experiencia explícito de H5 ("no una barra de progreso técnica o ansiógena") — no es una violación del DS en sí, pero es una inconsistencia con la historia que vale marcar.
- **Toast de confirmación no sigue el spec de Toast/snackbar**: `shareBanner` no es un overlay flotante con fondo Grafito/texto Lino como define la sección 8.3, sino un bloque en el flujo normal del documento con estilo de card clara.
- **Modal centrado en vez de bottom sheet / full-bleed**: `CompareModal` es una excepción justificada (ligada al momento hero de VTON), pero al implementarse como card centrada con padding y bordes de 24px en vez de un tratamiento full-screen, se aleja parcialmente del "sombra nivel 3, modal, resultado VTON en pantalla completa" que describe la sección 3.3 para ese mismo momento.
- **Falta de estado de error de generación**: ver gap correspondiente — H5 define explícitamente este caso borde y ni el DS ni el repo lo cubren hoy.
