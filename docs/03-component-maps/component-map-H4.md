# Component Map: H4 - Subir la foto de la prenda con validación de calidad

## Resumen de la historia
Como usuaria, quiero subir una foto de una prenda que ya tengo y ser avisada si tiene un problema evidente de calidad, para asegurarme de que el resultado del VTON va a ser representativo.

**Criterios de aceptación funcionales:**
- La usuaria puede subir una foto de una prenda propia desde su dispositivo (cámara o galería).
- El sistema evalúa la foto de la prenda con el mismo criterio de calidad que la foto propia (muy oscura, recortada, borrosa) antes de generar el resultado.
- Si detecta un problema, informa el problema que tiene la foto y ofrece volver a intentar sin perder la foto propia ya cargada con un CTA para borrar la foto y volver a subirla.
- Si la foto pasa la validación, el sistema muestra la foto cargada con un mensaje de "Prenda cargada con exito" y un CTA para poder borrar la foto si lo desea.

**Criterios de experiencia:**
- Mismo tono tranquilo que en H3 para el aviso de calidad insuficiente.
- Queda claro en pantalla que la foto propia ya cargada se mantiene — la usuaria no debe temer tener que repetir ese paso.

**Casos borde:** permisos de cámara/galería denegados; foto sin prenda reconocible (fuera de alcance funcional definido, ver "Preguntas para PO" del PRD); usuaria intenta subir la misma foto que ya usó como foto propia.

**Dependencias:** depende de H3. **Prioridad:** alta (F1 + F5).

## Pantallas involucradas
- **`Step1Garment`** (`src/components/Step1Garment.tsx`) — pantalla real donde hoy se sube/captura la foto de la prenda (cámara en vivo o galería). Es el candidato de pantalla para H4 en el código actual.
- **Nota de mapeo importante**: en `docs/DESIGN.md` sección 8.5 no existe una entrada de pantalla específica "Subí tu prenda" — solo figura "Subí tu primera foto (con guía así-sí/así-no)", que en el inventario está pensada para la foto propia. `Step1Garment` reutiliza el mismo patrón visual (card de captura + guía así-sí/así-no) aplicado a la prenda, lo cual es consistente en estilo, pero no está explícitamente inventariado como pantalla propia. Ver Riesgos.
- Modal de guía: **`GarmentPhotoGuideModal`** (`src/components/GarmentPhotoGuideModal.tsx`), ya implementado y enlazado desde `Step1Garment`.
- No existe ninguna pantalla ni estado dedicado a "problema de calidad detectado" — no está en el inventario de `DESIGN.md` como pantalla separada (el patrón esperado por el DS es un estado inline dentro de la misma card, no una pantalla nueva).

## Componentes del DS a usar
- `Step1Garment` (pantalla/template, ya implementado) — hospeda toda la interacción de captura/carga de la prenda.
- `GarmentPhotoGuideModal` (organismo, ya implementado) — guía así-sí/así-no específica de prenda, con 4 indicaciones y banner de privacidad.
- Botón primario (átomo) — estilo `primaryActionButton` dentro de `Step1Garment`: "Tomar foto a una prenda" (fondo Ciruela, texto Lino/blanco, radius-md).
- Botón secundario (átomo) — estilo `secondaryActionButton`: "Subir de mi galería" (fondo Lino, borde Niebla).
- Botón terciario/texto (átomo) — estilo `repeatLink`/`guideLink` dentro de `uploadedFeedbackBox`: "Repetir" / "Ver guía" (solo texto, subrayado).
- Overlay comparativo "así sí/así no" (molécula) — implementado dos veces: `guidanceGrid` dentro de `Step1Garment` y `comparisonGrid` dentro de `GarmentPhotoGuideModal`, ambos con badges "Así sí" (Salvia) / "Así no" (Error/Terracota).
- Card de subida/captura (molécula, parcialmente correspondiente) — `captureCard` en `Step1Garment`: ícono cámara + texto de guía, aunque implementada como card sólida en Bruma, no como "zona punteada" tal como la describe `DESIGN.md` 8.2.
- Thumbnail de prenda (átomo) — `uploadedThumb` dentro de `uploadedFeedbackBox`, muestra la miniatura de la prenda ya cargada.

## Componentes a extender
- **Card de subida/captura (`captureCard` en `Step1Garment`)** — necesita una variante/estado de "calidad insuficiente detectada" que hoy no existe: debe poder mostrar, en el mismo lugar donde hoy aparece el checklist estático, el motivo específico del problema (oscuridad / recorte / desenfoque) y un CTA de "reintentar" que relance la selección de archivo sin perder el resto del contexto de pantalla.
- **`uploadedFeedbackBox` / checklist de validación** — hoy es un bloque de texto fijo (`✓ Silueta detectada`, `✓ Caída natural`, `✓ Fondo adaptable`) que se muestra siempre que `selectedGarment.isCustomUpload` es verdadero, sin ninguna evaluación real. Necesita extenderse para aceptar un resultado de validación condicional (aprobado / rechazado con motivo) en vez de un estado siempre positivo.
- **Botón terciario/texto (`repeatLink`)** — hoy solo relanza el input de archivo; para H4 necesita poder recibir el motivo de fallo como contexto (para telemetría/mensaje), sin cambiar su apariencia.
- **Banner de estado tipo `statusBanner` (de `Step2Reference.tsx`)** — no es parte nativa de `Step1Garment`, pero es el componente más cercano en el repo al patrón "mostrar que un paso anterior ya está resuelto" (thumbnail + label + `CheckCircle2` en Salvia). Si se necesita comunicar "tu foto propia ya cargada se mantiene" dentro de la pantalla de carga de la prenda, este es el patrón a extender/replicar, no a inventar uno nuevo.

## Gaps (componentes que no existen en el DS ni en el repo)
- **Validación real de calidad de imagen (oscuridad / recorte / desenfoque)** — no existe en el código (ninguna lógica de análisis de imagen en `src/`) ni está definida operativamente en `DESIGN.md` (que solo especifica el *look* del mensaje resultante, vía la molécula "Indicador de calidad de foto": "ícono + mensaje: 'Buena luz ✓' / 'Poca luz, ¿otra foto?'"). El checklist actual de `Step1Garment` es decorativo/estático, no una validación.
  - **Resolución temporal sugerida**: implementar el resultado de la validación (real o simulada) usando el patrón visual ya inventariado "Indicador de calidad de foto", ubicado inline dentro de la `captureCard` existente — en el mismo lugar donde hoy vive el checklist estático — en vez de como modal o bottom sheet, porque bloquea el avance antes de continuar y no es una confirmación transitoria. Reutilizar el mismo patrón visual que ya usa `errorText` en `Step1Garment` para errores de permiso de cámara, para mantener consistencia de tono dentro del mismo archivo.
- **Retry contextual "sin perder la foto propia ya cargada"** — el criterio de H4 asume el orden narrativo del PRD (H3 antes de H4), pero el flujo real implementado en `App.tsx` sube la prenda primero (`step1_garment`) y la foto propia después (`step2_reference`). Hoy no hay ningún estado en código que muestre una "foto propia ya cargada" durante la carga de la prenda, porque en el orden actual todavía no existe.
  - **Resolución temporal sugerida**: si se decide resolver manteniendo el orden actual del código, replicar el patrón exacto de `statusBanner` de `Step2Reference.tsx` (thumbnail + "Prenda lista" + `CheckCircle2` en Salvia) en sentido inverso dentro de `Step1Garment`, una vez reordenado el flujo. El reordenamiento de pasos en `App.tsx` es una decisión de arquitectura de navegación que excede el alcance de este mapeo de Design System — se deja marcado como riesgo, no resuelto acá.
- **Detección de "misma foto ya usada como foto propia" (caso borde)** — no hay componente de comparación de archivos ni mensaje de UI definido para este caso en ninguna de las dos fuentes.
  - **Resolución temporal sugerida**: reutilizar el mismo patrón del Indicador de calidad de foto (ícono + mensaje breve, tono de sugerencia, no de error duro), ya que semánticamente es "un problema evidente detectado antes de continuar", igual que oscuridad/recorte/desenfoque — no amerita un componente nuevo.

## Tokens relevantes
- **Colores**: Ciruela `#7A4655` (CTA "Tomar foto"/"Subir de mi galería"/"Continuar"), Bruma `#ECE4DA` (fondo de `captureCard`), Salvia `#8C9B7E` (checklist positivo, badge "Así sí"), Error/terracota `#A85A46` (badge "Así no", mensajes de calidad insuficiente, reutilizable para el gap de validación real), Piedra `#75695E` (texto secundario/subtítulos de guía).
- **Spacing**: margen lateral de pantalla 20px (`paddingHorizontal: 20`), padding interno de card 18px, gap entre botones de acción 10px, gap entre elementos del checklist ~8px.
- **Tipografía**: Body M/Caption (sans UI) para textos de guía, subtítulos y checklist — consistente con la regla de reservar la serifa editorial solo para momentos.
- **Radios / sombra**: `radius-lg` (20px) en `captureCard` y `videoWrapper`, `radius-md` (14px) en botones principales, `radius-sm` (8-10px) en thumbnails; sin sombra explícita en la capture card (nivel 0, fondo plano dentro de la pantalla).
- **Movimiento**: no hay transición definida hoy para la aparición/desaparición del checklist o de un futuro estado de error — debería usar el easing genérico de UI (`ease-out`, 200-280ms, sección 6 de `DESIGN.md`), no el fade+escala reservado para el momento hero del resultado VTON.

## Patrones de interacción
- **Guía así-sí/así-no**: ya resuelta por `GarmentPhotoGuideModal` + `guidanceGrid` (dentro de `Step1Garment`), con imágenes reales y badges de color semántico.
- **Estado de calidad insuficiente + retry**: no resuelto aún. Debe implementarse como estado inline dentro de la `captureCard` (mismo patrón que el error de permiso de cámara), no como bottom sheet ni toast — porque bloquea el avance antes de continuar, no es una confirmación transitoria que desaparece sola.
- **Volver a intentar sin perder contexto**: el link "Repetir" (`repeatLink`) ya es el Botón terciario/texto que resuelve la mecánica de "reintentar sin reiniciar el flujo" (relanza el input de archivo sin navegar a otra pantalla).

## Componentes transversales de esta historia
- Botón primario, Botón secundario, Botón terciario/texto, Card de subida/captura, Overlay comparativo así-sí/así-no, Thumbnail de prenda, Indicador de calidad de foto (gap, pendiente de implementación real).

## Riesgos / inconsistencias con el DS detectadas
- **Orden de flujo invertido respecto al PRD**: el código sube la prenda (`step1_garment`) antes que la foto propia (`step2_reference`), mientras las historias asumen H3 (foto propia) antes de H4 (prenda). Esto afecta directamente el criterio de aceptación "ofrece volver a intentar sin perder la foto propia ya cargada" — no puede haber una foto propia "ya cargada" si en el código real la prenda se sube primero. Riesgo de mapeo señalado, no resuelto en este documento.
- **Bottom sheet vs modal centrado**: `GarmentPhotoGuideModal` está implementado como modal centrado (`backdrop` + card centrada con `position: fixed`), no como el "bottom sheet de acción" que `DESIGN.md` define como patrón bloqueante por defecto. No es el caso de excepción documentado (full-screen bloqueante tipo resultado VTON), por lo que es una inconsistencia real preexistente en un componente que esta historia reutiliza.
- **Checklist siempre positivo**: el bloque `✓ Silueta detectada / ✓ Caída natural / ✓ Fondo adaptable` en `Step1Garment` se muestra siempre que hay una prenda propia cargada, sin ninguna validación real de calidad — no cumple el criterio funcional central de H4 y no corresponde al comportamiento bidireccional (positivo/negativo) que especifica la molécula "Indicador de calidad de foto" en el inventario.
- **Serifa vs sans en H1 de pantalla**: el `headline` de `Step1Garment` ("Primero, una prenda que ames") usa `fontFamily: 'sans-serif'`, mientras `DESIGN.md` especifica serifa editorial para el H1 de pantalla principal. Inconsistencia tipográfica preexistente en el archivo que hospedará esta historia — no introducida por H4, pero relevante si se toca el componente.
- Regla 80/15/5: no se detectan múltiples acentos Ciruela compitiendo en esta pantalla — sin riesgo en este punto.
