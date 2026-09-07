# Component Map: H6 - Calificar si el resultado se parece a la usuaria

## Resumen de la historia
Como usuaria que acaba de ver su resultado, quiero poder decir si se parece a mí o no, para que el equipo de producto sepa si la calidad del VTON es confiable.

- **Criterios de aceptación funcionales**: inmediatamente después de mostrar el resultado se presenta una pregunta breve de calidad percibida (ej. "¿Este resultado se parece a vos?"); la respuesta queda registrada asociada a ese resultado para instrumentación de la métrica de calidad del MVP; responder no es bloqueante, la usuaria puede continuar el flujo (H7 o H8) sin responder.
- **Criterios de experiencia**: la pregunta se siente como un gesto simple (dos opciones tipo sí/no o una escala corta), no como una encuesta; no interrumpe la posibilidad de seguir mirando el resultado.
- **Casos borde**: usuaria ignora la pregunta y sale de la pantalla directamente; usuaria responde y luego quiere generar otro VTON (H7) — ambas acciones deben convivir sin fricción.
- **Dependencias**: depende de H5.
- **Prioridad**: media — instrumentación de la métrica de calidad del MVP (sección 9 del PRD), no bloquea el loop funcional core.

## Pantallas involucradas
- **Resultado de prueba — comparar y guardar** (inventario 8.5 de `DESIGN.md`), implementada hoy en el repo como `src/components/Step3Result.tsx` — es la pantalla donde vive el `heroCard` con la imagen VTON generada en H5; el gesto de feedback de H6 se agrega dentro de esta misma pantalla, inmediatamente después del hero.
- No se agrega una pantalla nueva: la pregunta es un elemento adicional dentro de la pantalla de resultado ya existente, no un paso de flujo separado.

## Componentes del DS a usar
- `Step3Result` (template/pantalla real, `src/components/Step3Result.tsx`) — pantalla anfitriona; el bloque de feedback de H6 se ubica entre el `heroCard` (líneas 64-136) y el `metadataWrapper` (línea 146), o inmediatamente debajo de este, para no competir con la imagen resultado ni con la card de conversión de cuenta.
- Botón de ícono circular (átomo, inventario 8.1 de `DESIGN.md`) — en el código no existe como componente reutilizable exportado; el patrón visual equivalente está inline en `Step3Result.tsx` como `actionCircleButton` / `favoriteActiveButton` (estilos, líneas 398-408): círculo 36×36, fondo Bruma en reposo, ícono Grafito, fondo Ciruela sólido + ícono Lino cuando está seleccionado. Es la base visual más cercana para los dos controles "Sí" / "No" de H6.
- Toast/snackbar (organismo, inventario 8.3 de `DESIGN.md`) — pendiente de implementación como componente reutilizable en el repo. Existe un patrón parcial en `Step3Result.tsx` (`shareBanner`, líneas 138-143 y estilos 409-424) usado para confirmar que se copió el link al compartir; puede reutilizarse como confirmación breve tras responder la pregunta de H6 ("Gracias por tu respuesta"), pero ver "Componentes a extender" — sus tokens actuales no coinciden con el spec real de toast/snackbar de `DESIGN.md`.

## Componentes a extender
- Patrón `actionCircleButton` de `Step3Result.tsx` — hoy solo maneja un toggle único (favorito, on/off). Para H6 hace falta una variante de **dos controles mutuamente excluyentes** (Sí / No), donde solo uno puede quedar seleccionado a la vez, con el mismo lenguaje visual de fondo Ciruela + ícono Lino en el estado seleccionado y fondo Bruma + ícono Grafito en el no seleccionado. No es un cambio de props triviales sobre el botón existente: implica manejar estado de grupo (selección exclusiva), no solo un booleano individual.
- `shareBanner` de `Step3Result.tsx` — si se reutiliza para confirmar la respuesta de H6, sus tokens de color actuales (fondo `#FAF7F2` claro, borde Salvia) no coinciden con el spec de toast/snackbar de `DESIGN.md` sección 8.3 (fondo Grafito, texto Lino, aparición discreta desde abajo). Habría que ajustar el componente a esos tokens antes de reutilizarlo como confirmación de H6, o construir el toast real por primera vez siguiendo el spec en vez de extender `shareBanner` tal cual está.

## Gaps (componentes que no existen en el DS ni en el repo)
- **Pregunta de calificación rápida post-resultado** — el inventario de `DESIGN.md` no define una molécula para esta interacción puntual (no es "Indicador de calidad de foto", que es sobre la foto subida antes de generar, no sobre el resultado ya generado; tampoco es "Overlay comparativo así sí/así no", que compara dos fotos de encuadre, no mide percepción de parecido).
  - **Resolución temporal sugerida**: combinar un texto Body M / H3 (la pregunta, ej. "¿Este resultado se parece a vos?") con dos instancias del átomo botón de ícono circular en su variante extendida de selección exclusiva (ver "Componentes a extender"), o alternativamente dos instancias del átomo chip de filtro en modo toggle exclusivo con label de texto ("Sí" / "No") en vez de ícono — cualquiera de las dos combina únicamente átomos ya inventariados, sin introducir un componente nuevo de nivel molécula formal hasta que el DS lo documente.

## Tokens relevantes
- Colores: Ciruela (estado seleccionado del control Sí/No, ícono o texto activo) — ver riesgo de acumulación de acento más abajo; Bruma (fondo en reposo de los controles); Grafito (ícono/texto en reposo); Salvia (alternativa recomendada para el estado seleccionado si se quiere evitar sumar otro uso de Ciruela en la misma pantalla, dado que "confirmaciones suaves" es justamente el uso documentado de Salvia en la sección 1.4 de `DESIGN.md`); Piedra (texto secundario de la pregunta, si no se usa Grafito).
- Spacing: separación de 16px entre el `heroCard` y el bloque de la pregunta (consistente con el spacing de 16 ya usado entre `heroCard` y `shareBanner`/`metadataWrapper` en el código); gap de 8-12px entre los dos controles Sí/No.
- Tipografía: Body M o H3 (sans UI) para el texto de la pregunta — nunca Display/H1 serifa, porque este texto es funcional y recurrente en cada resultado, no un "momento" de marca.
- Radios / sombra: radius-full (999px) si se usan botones de ícono circular; radius-sm (8px) si se usan chips rectangulares/pill con texto "Sí"/"No"; sin sombra o sombra nivel 1 como máximo (el bloque no es un elemento elevado tipo sheet).
- Movimiento: micro-transición de escala 0.98 al presionar cada control (sección 6 de `DESIGN.md`, mismo patrón que selección de prenda/outfit), sin bounce; alternativa estática (crossfade) si hay *reduced motion* activado.

## Patrones de interacción
- **No bloqueante**: la pregunta se resuelve con un elemento inline dentro de `Step3Result`, no con un bottom sheet ni con nada full-screen — la usuaria puede ignorarla y seguir interactuando con el resto de la pantalla (comparar, compartir, favorito, continuar a H7/H8) sin ninguna restricción, tal como pide el criterio de aceptación de H6.
- **Confirmación tras responder**: toast/snackbar (ver "Componentes del DS a usar" y su extensión pendiente) para un mensaje breve tipo "Gracias por tu respuesta", coherente con el uso documentado del toast (confirmación temporal que desaparece sola) — no corresponde banner de privacidad (reservado a mensajes persistentes de privacidad) ni bottom sheet (reservado a decisiones bloqueantes).
- **Selección exclusiva Sí/No**: mismo lenguaje de micro-interacción que el toggle de favorito ya implementado (`isFavorite` en `Step3Result.tsx`), pero aplicado a un grupo de dos opciones en vez de un solo booleano.

## Componentes transversales de esta historia
- Patrón de botón de ícono circular (Bruma/Ciruela, según estado) — es el bloque visual base reutilizado para construir el control Sí/No.
- Toast/snackbar — reutilizado como confirmación de que la respuesta quedó registrada.

## Riesgos / inconsistencias con el DS detectadas
- **Posible acumulación de acento Ciruela en la misma pantalla**: `Step3Result.tsx` ya usa Ciruela como fondo sólido en el botón de favorito activo (`favoriteActiveButton`) y en el `hangerBadge` de la card de conversión a cuenta. Si el control "Sí" seleccionado de H6 también se resuelve en Ciruela sólido, la pantalla de resultado sumaría un tercer elemento con el mismo acento fuerte compitiendo por atención, lo que tensiona la regla 80/15/5 y "un acento fuerte por pantalla" de la sección 1.7 de `DESIGN.md`. Se sugiere evaluar Salvia para el estado seleccionado de H6 en vez de Ciruela, o revisar en conjunto los tres usos antes de implementar.
- **No hay componentes atómicos extraídos como reutilizables en el repo todavía**: toda la UI de `Step3Result.tsx` y `CompareModal.tsx` está resuelta con `TouchableOpacity`/`View` y `StyleSheet.create` inline por archivo, sin una carpeta `atoms/molecules/organisms` que materialice el inventario de `DESIGN.md` como componentes propios. Esto no es un problema de esta historia puntual, pero implica que "extender" un átomo para H6 hoy significa duplicar el patrón visual dentro de `Step3Result.tsx`, no importar y extender un componente compartido — vale la pena que el equipo lo tenga presente si varias historias (H6, H7, H8) terminan reimplementando el mismo botón de ícono circular por separado.
- **Ambigüedad de forma del control** (ícono circular vs. chip con texto "Sí"/"No"): la historia no especifica cuál de las dos formas visuales debe tener el gesto, y ambas son igualmente válidas combinando átomos existentes del inventario — se deja explícito para que se defina antes de implementar, en vez de asumir una.
