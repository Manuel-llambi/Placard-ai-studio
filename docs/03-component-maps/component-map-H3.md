# Component Map: H3 - Subir la foto propia con validación de calidad

## Resumen de la historia
Como usuaria, quiero subir una foto mía (cuerpo entero o torso) y ser avisada si tiene un problema evidente de calidad, para no llegar a un resultado de VTON pobre por una foto que puedo corregir antes.

**Criterios de aceptación funcionales**:
- La usuaria puede subir una foto propia desde su dispositivo (cámara o galería).
- Antes de continuar al siguiente paso, el sistema evalúa si la foto tiene problemas evidentes de calidad (muy oscura, recortada, borrosa).
- Si detecta un problema, informa el motivo de forma específica y ofrece volver a intentar sin perder el contexto (no hay que reiniciar el flujo desde H1).
- Si la foto pasa la validación, la usuaria avanza al paso de subir la foto de la prenda.

**Criterios de experiencia**:
- El aviso de calidad insuficiente se siente como una sugerencia útil ("mejor probemos con otra"), no como un rechazo o error del sistema.
- Mientras se evalúa la calidad hay un estado de carga breve y claro, sin sensación de que el sistema se colgó.

**Casos borde**: permisos de cámara/galería denegados; foto que no es una persona (fuera de alcance de validación de calidad según PRD); formato/tamaño no soportado; cancelación a mitad de camino.

**Dependencias**: depende de H2. **Prioridad**: alta (F1 + F5 del PRD).

## Pantallas involucradas
- **Subí tu primera foto (con guía así-sí/así-no)** — inventario `DESIGN.md` sección 8.5. En el repo real esta pantalla corresponde a `Step2Reference` (paso "Tu foto de referencia" dentro del flujo `step2_reference` de `OnboardingStep`, ver `src/types.ts` y `src/App.tsx`), no a una pantalla separada de "Subí tu primera foto" — el repo unificó guía + captura + CTA en una sola vista.
- Nota de nomenclatura: pese a llamarse "Step2Reference" en el código, funcionalmente es la pantalla de H3 (sube la foto propia). H4 (foto de prenda) vive en `Step1Garment`. El orden código (prenda primero, cuerpo después) es inverso al orden narrativo del PRD (cuerpo primero, H3, luego prenda, H4) — dejarlo señalado en "Riesgos", no es un problema del DS pero sí una discrepancia a confirmar con PO/equipo.
- Modal de guía asociado: `BodyPhotoGuideModal` (así-sí/así-no ampliado), invocado desde dentro de `Step2Reference`.

## Componentes del DS a usar
- `Step2Reference` (template/pantalla, ya implementado en `src/components/Step2Reference.tsx`) — contenedor de toda la historia: stepper, banner de estado de la prenda, card de captura, guía comprimida, banner de privacidad y CTA final.
- `BodyPhotoGuideModal` (organismo tipo bottom-sheet/modal, implementado en `src/components/BodyPhotoGuideModal.tsx`) — guía ampliada "así sí / así no" con tips, abierta desde el link "¿Cómo sacar una buena foto?".
- Botón primario (átomo, inventario 8.1; implementado inline como `styles.primaryActionButton` en `Step2Reference.tsx`) — "Tomar foto a mi cuerpo".
- Botón secundario (átomo, inventario 8.1; implementado inline como `styles.secondaryActionButton`) — "Subir de mi galería".
- Card de subida/captura (molécula, inventario 8.2; implementada inline como `styles.captureCard` en `Step2Reference.tsx`) — zona con ícono cámara + copy de guía, aunque en el código actual no tiene el borde punteado que describe la especificación de la molécula (ver Riesgos).
- Overlay comparativo "foto así / así no" (molécula, inventario 8.2; implementada inline como `styles.guidanceGrid` dentro de `Step2Reference` y como `styles.comparisonGrid` dentro de `BodyPhotoGuideModal`) — dos miniaturas con badge de check/cruz, usando `GUIDE_PHOTOS` de `src/data/samples.ts`.
- Banner de privacidad (molécula, inventario 8.2; implementada inline como `styles.privacyBanner` en ambos componentes) — ícono candado/shield + texto + fondo Salvia suave.
- Stepper de onboarding (molécula, inventario 8.2; implementado inline como `styles.indicatorContainer`/`progressBarTrack` en `Step2Reference.tsx`) — "Paso 2 de 2 • Tu cuerpo" + barra de progreso.
- Divider (átomo, inventario 8.1; implementado como `borderTopWidth`/`borderBottomWidth` inline en ambos componentes).

## Componentes a extender
- **`Step2Reference`**: necesita un nuevo estado de UI intermedio entre "foto elegida" y "avanzar al paso siguiente" — hoy `handleFileUpload` y `captureCameraSnapshot` llaman `onSelectReferencePhoto` y habilitan el CTA de inmediato, sin ningún paso de evaluación de calidad en el medio. Hay que insertar un estado `evaluandoCalidad` (loading breve) y un estado `calidadInsuficiente` (con motivo) antes de considerar la foto "lista".
- **`ReferencePhoto` (tipo de dominio, `src/types.ts`)**: no tiene ningún campo de calidad — necesitaría algo como `qualityIssue?: 'muy_oscura' | 'recortada' | 'borrosa' | null` para poder representar el resultado de la validación y que `Step2Reference` renderice el motivo específico.
- **Botón secundario / link "¿Cómo sacar una buena foto?"**: el patrón de "reintentar sin perder contexto" del criterio de aceptación necesita que el mismo botón de reintento quede disponible directamente desde el estado de error, no solo desde el estado inicial — extensión de comportamiento, no de estilo.
- **Card de subida/captura (`styles.captureCard`)**: necesita una variante visual de "estado de error" (hoy solo tiene estado normal y estado cámara activa) para mostrar el motivo de calidad insuficiente dentro de la misma card, sin sacar a la usuaria del flujo.

## Gaps (componentes que no existen en el DS ni en el repo)
- **Indicador de calidad de foto** — está en el inventario de `DESIGN.md` (sección 8.2: "ícono + mensaje: 'Buena luz ✓' / 'Poca luz, ¿otra foto?'") pero no tiene ninguna implementación en `src/components/`. Es exactamente el componente que le falta a esta historia: hoy no existe ningún lugar en el código que evalúe ni comunique calidad de foto.
  - **Resolución temporal sugerida**: combinar un ícono de estado (línea si el resultado es negativo, relleno Ciruela/Salvia si es positivo — mismo patrón del set de íconos de sección 4) + un `Text` en Caption/Body M dentro de la card de subida/captura existente (`styles.captureCard`), reusando el color Salvia para el mensaje positivo y el color Error (Terracota `#A85A46`) solo en el texto/ícono para el mensaje negativo — nunca como fondo grande de la card, para no romper la regla 80/15/5.
- **Estado de carga breve durante la evaluación de calidad** — el único loader de marca implementado en el repo es `ProcessingModal` (spinner de percha + barra de progreso a pantalla completa), pensado para la generación del VTON (H5), con textos y tiempos (varios segundos, pasos narrativos) que son demasiado pesados para "una evaluación de calidad breve" como pide H3.
  - **Resolución temporal sugerida**: no reutilizar `ProcessingModal` tal cual. Usar una versión liviana in-line (no modal a pantalla completa) del spinner/loader de marca de la sección 6 — por ejemplo el ícono de percha o una barra de progreso lineal en Ciruela suave, pero contenida dentro de la card de subida/captura, con un texto corto tipo Caption ("Revisando tu foto…") en vez del set de 4 pasos narrativos de `ProcessingModal`.
- **Mensaje específico de error de calidad con tono de sugerencia (no de rechazo)** — no existe ningún componente ni patrón de copy para esto en el repo. El único precedente de mensaje de error visible es `cameraError` en `Step2Reference` (permiso de cámara denegado), que usa un `Text` suelto (`styles.errorText`) sin ícono ni estructura de card, y con un tono correcto pero sin reutilizar ningún átomo/molécula del DS.
  - **Resolución temporal sugerida**: no crear un componente de "alerta" nuevo. Resolverlo combinando el Indicador de calidad de foto (gap anterior) con el copy ya usado como precedente de tono en `cameraError` ("no pudimos... elegí otra foto / revisá..."), y dejar de usar `styles.errorText` como estilo ad-hoc.
- **Explicación de permiso de cámara/galería denegado con cómo habilitarlo** (caso borde explícito de H3) — no existe en el repo; `cameraError` hoy solo dice "No pudimos acceder a la cámara" y cae automáticamente al input de archivo, pero no explica cómo habilitar el permiso a nivel sistema operativo.
  - **Resolución temporal sugerida**: usar el patrón de **bottom sheet de acción** (organismo, inventario 8.3) para este caso — es bloqueante y requiere una acción explícita de la usuaria (ir a configuración del OS o elegir de galería), coherente con la regla del DS de que lo bloqueante no usa un modal centrado genérico sino bottom sheet.

## Tokens relevantes
- **Colores**: Ciruela (`#7A4655`, CTA primario "Tomar foto a mi cuerpo", ícono cámara, único acento fuerte de la pantalla) · Ciruela suave (uso en estados hover/pressed, no visto explícito en el código actual pero es el token correcto para ese caso) · Salvia (`#8C9B7E`, confirmación "prenda lista", indicador positivo de calidad) · Salvia suave (`#D3DAC7`/`rgba(211,218,199,.3)`, fondo del banner de privacidad) · Error/Terracota (`#A85A46`, badge "así no" y mensaje de calidad insuficiente — solo en ícono/texto, nunca fondo grande) · Piedra (`#75695E`, texto secundario/subtítulos) · Grafito (`#2B2420`, texto principal) · Lino/Bruma (`#F6F1EA`/`#ECE4DA`, fondos de superficie y card).
- **Spacing**: margen lateral de pantalla 20px (`paddingHorizontal: 20` en `Step2Reference`); gaps internos en la escala 4·8·12·16 (ej. `gap: 8` en `guidanceGrid`, `gap: 10` en `actionButtonsStack`).
- **Tipografía**: H1 serifa reservado para el título de la pantalla ("Ahora, tu foto de referencia" usa actualmente `fontFamily: 'sans-serif'` con tamaño 26 — ver Riesgos, es un H1 pero implementado como sans, no serifa editorial); H3 sans UI para "Capturá tu foto de cuerpo"; Body M/Caption sans UI para descripciones y copy de guía.
- **Radios / sombra**: `radius-lg` (20px) en la card de captura (`captureCard`) y en las imágenes de guía; `radius-md` (14px) en botones primario/secundario y en el banner de privacidad; `radius-full` en los badges "así sí/así no". Sombra: la card de captura no lleva sombra explícita en el código (fondo Bruma plano) — coherente con nivel 1 o nivel 0, no hay elevación fuerte en este paso del flujo, lo cual es correcto porque no es un momento "hero".
- **Movimiento**: transición de cámara activa/inactiva (`isCameraActive`) no tiene una animación explícita en el código — debería usar el `ease-out` 200–280ms de la sección 6 para el cambio entre card estándar y vista de cámara en vivo. El futuro estado de "evaluando calidad" también debería seguir ese mismo easing discreto, reservando el movimiento con más personalidad (fade + escala 0.96→1.0) exclusivamente para el resultado VTON (H5), no para esta pantalla.

## Patrones de interacción
- **Carga breve mientras se evalúa la calidad**: no resuelto hoy por ningún componente del repo (ver gap "Estado de carga breve"). Debe resolverse con una versión liviana del spinner/loader de marca de sección 6, in-line dentro de la card de captura, nunca con el `ProcessingModal` de pantalla completa.
- **Aviso de calidad insuficiente con tono de sugerencia**: no resuelto hoy (ver gap correspondiente). Debe resolverse combinando el Indicador de calidad de foto con el botón de reintento ya existente (`primaryActionButton`/`secondaryActionButton`), reutilizados directamente desde el estado de error para no perder contexto ni reiniciar el flujo.
- **Permiso de cámara/galería denegado**: parcialmente resuelto — `Step2Reference` ya hace fallback automático a `cameraInputRef` cuando falla `getUserMedia`, y muestra `cameraError`, pero sin explicar cómo habilitar el permiso a nivel sistema. Patrón correcto del DS para completarlo: bottom sheet de acción (no modal centrado).
- **Guía ampliada "así sí / así no"**: totalmente resuelto por `BodyPhotoGuideModal`, que ya sigue el patrón de bottom-sheet/modal con backdrop, cierre por click-fuera y tecla Escape.
- **Selección de foto (cámara en vivo, galería, demo)**: resuelto en `Step2Reference` mediante `startLiveCamera`/`captureCameraSnapshot`/`handleFileUpload`, con micro-transición de escala esperable en los botones al presionar (no confirmado en el código si `activeOpacity` cubre ese caso — ver Riesgos).

## Componentes transversales de esta historia
- `Step2Reference` (contenedor completo de la historia).
- `BodyPhotoGuideModal` (guía ampliada, reutilizable también fuera de H3 si se necesitara reforzar la guía en otro punto del flujo).
- Card de subida/captura y Overlay comparativo "así sí/así no" — ambos son moléculas transversales entre H3 (foto propia) y H4 (foto de prenda, que usa el patrón equivalente en `Step1Garment`/`GarmentPhotoGuideModal`, no analizado en este archivo).

## Riesgos / inconsistencias con el DS detectadas
- **H1/Display en `sans-serif` en vez de serifa editorial**: el headline "Ahora, tu foto de referencia" (`styles.headline`, `fontFamily: 'sans-serif'`) debería usar la serifa editorial según la sección 2 de `DESIGN.md`, que reserva H1/Display para "momentos" como el onboarding de foto. Es una pantalla de onboarding de foto explícita — encaja en la excepción, no en la regla de "UI recurrente" — por lo que el uso de sans acá es una desviación del DS a confirmar, no una aplicación correcta de la regla "serifa solo para momentos".
- **Card de subida/captura sin borde punteado**: el inventario de `DESIGN.md` describe esta molécula como "zona punteada con ícono cámara"; la implementación real (`styles.captureCard`) usa un fondo Bruma sólido sin borde punteado. No es necesariamente un error — puede ser una decisión de estilo válida — pero es una divergencia entre el inventario documentado y el componente real que vale la pena señalar.
- **Mensaje de error (`cameraError`) fuera del lenguaje del DS**: usa un `Text` suelto con fondo Bruma y texto en color Error, sin ícono ni estructura de card — no sigue ni el patrón de Banner de privacidad ni el de Toast/snackbar del inventario. Ver gap correspondiente.
- **Ausencia total de validación de calidad técnica en el código**: este es el riesgo central de la historia. Ningún componente actual de `src/components/` evalúa oscuridad, recorte o desenfoque — `handleFileUpload` y `captureCameraSnapshot` aceptan cualquier imagen de inmediato y habilitan el CTA "Ver cómo te queda" sin ningún paso intermedio. Toda la sección de "Gaps" de este archivo depende de esta ausencia; no es un tema de mapeo contra el DS sino de funcionalidad no implementada aún, y debe entenderse como tal antes de asignar trabajo de diseño visual sobre componentes que hoy no tienen ningún estado que representar.
- **Ambigüedad en la nomenclatura de pasos**: el componente que resuelve H3 se llama `Step2Reference` en el código, pero según el PRD/historias H3 es conceptualmente el primer paso de captura de fotos (antes de la prenda, H4/`Step1Garment`). Esto no es un problema de diseño sino de orden narrativo vs. orden de implementación — señalado para que no se asuma erróneamente que "Step2" implica que H3 ocurre después de H4 en la experiencia real.
