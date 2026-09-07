# Component Map: H8 - Eliminar la foto propia

## Resumen de la historia
Como usuaria preocupada por mi privacidad, quiero poder eliminar mi foto original en cualquier momento después de ver un resultado, para tener control real sobre mi imagen.

**Criterios de aceptación funcionales**:
- Después de generar al menos un resultado, la usuaria tiene disponible una acción explícita para eliminar su foto propia original.
- Al confirmar la eliminación, la foto propia deja de estar disponible para nuevos VTON en la sesión (bloquea H7 hasta que se suba una nueva).
- La eliminación es efectiva de inmediato, no queda pendiente ni requiere confirmación adicional fuera de la acción misma.

**Criterios de experiencia**:
- La acción de eliminar es fácil de encontrar (no escondida en un menú de configuración, dado que no existe pantalla de perfil en este MVP).
- El sistema confirma que la eliminación se realizó, con un mensaje breve y tranquilo, no alarmista.

**Casos borde**:
- Usuaria elimina la foto propia y luego intenta generar otro VTON (H7): debe pedirle una nueva foto propia como si fuera la primera vez.
- Usuaria elimina la foto propia mientras está en medio de la generación de un resultado (H5): el PRD no define este cruce (ver "Preguntas para PO" en `historias.md`).

**Dependencias**: depende de H3 (requiere que exista una foto propia cargada).
**Prioridad**: alta — el PRD (sección 8) la marca explícitamente como requisito de prioridad alta, complemento indispensable de la transparencia de datos (H2/F3).

## Pantallas involucradas
- `GuestWardrobePreview` (`src/components/GuestWardrobePreview.tsx`) — pantalla "hogar" tras el primer resultado (tabs Looks/Placard, banners de cuenta invitada/sincronizada). Es la candidata más persistente para alojar la acción, ya que es la pantalla en la que la usuaria pasa más tiempo después de ver un resultado.
- `Step3Result` (`src/components/Step3Result.tsx`) — pantalla inmediata al generar el primer resultado; también cumple literalmente el criterio "después de generar al menos un resultado".
- `Step2Reference` (`src/components/Step2Reference.tsx`) — pantalla afectada indirectamente: es donde el flujo vuelve a pedir la foto propia si se reintenta H7 después de la eliminación.
- Referencia de inventario (`docs/DESIGN.md` 8.5): "Perfil y privacidad (foto: cuándo se borra, botón eliminar)" figura como pantalla del inventario de diseño, pero **no existe implementada en el repo** — coincide con el propio criterio de experiencia de H8, que asume explícitamente que esa pantalla no existe en este MVP y que la acción debe vivir directamente en el flujo.

## Componentes del DS a usar
- **Bottom sheet de acción** (organismo — `docs/DESIGN.md` 8.3, componente definido en el inventario del DS, pendiente de confirmar implementación real en el repo: no existe `BottomSheet.tsx`/`ActionSheet.tsx` en `src/components/`). El propio inventario cita textualmente "Eliminar foto" como ejemplo de uso de este componente. Contiene la acción destructiva única; tocarla ejecuta la eliminación de inmediato, sin paso de confirmación adicional — coherente con el criterio de aceptación "no requiere confirmación adicional fuera de la acción misma".
- **Toast/snackbar** (organismo — `docs/DESIGN.md` 8.3, componente definido en el inventario del DS, pendiente de confirmar implementación real en el repo: no existe `Toast.tsx`/`Snackbar.tsx` en `src/components/`). Mensaje breve post-eliminación (fondo Grafito, texto Lino, aparición discreta desde abajo) — cumple el criterio "confirma que la eliminación se realizó, con un mensaje breve y tranquilo, no alarmista".
- **Botón de ícono circular** (átomo — `docs/DESIGN.md` 8.1, componente definido en el inventario del DS; el patrón visual ya existe inline en el código como `iconButton` en `Header.tsx` y `actionCircleButton` en `Step3Result.tsx`, aunque no como componente reutilizable exportado). Sirve como trigger que abre el bottom sheet.
- **Botón terciario / texto** (átomo — `docs/DESIGN.md` 8.1; el patrón ya existe inline en el código, ej. `guideTriggerText` en `Step2Reference.tsx` o `demoLinkText` en el mismo archivo). Alternativa de trigger tipo link ("Eliminar mi foto") si se prefiere un enlace de texto en vez de un ícono.
- **Banner de privacidad** (molécula — `docs/DESIGN.md` 8.2; implementado inline en el código como `privacyBanner`/`styles.privacyBanner` en `Step2Reference.tsx`, líneas 344-351). Reutilizable para reforzar contexto cerca del trigger si se decide explicar qué implica la eliminación.

## Componentes a extender
- `Header` (`src/components/Header.tsx`) — el `rightSlot` hoy solo renderiza un `spacer` vacío (línea 60: `<View style={styles.spacer} />`), sin ninguna acción real. Podría extenderse para alojar el trigger de esta acción de forma persistente en las pantallas post-resultado, dado que el criterio de experiencia exige que la acción sea "fácil de encontrar" sin que exista una pantalla de perfil.
- `GuestWardrobePreview` (`src/components/GuestWardrobePreview.tsx`) — no tiene hoy ninguna sección de cuenta/privacidad; necesitaría una fila o acción visible nueva (por ejemplo junto a `guestBanner`/`syncBanner`) que dispare el bottom sheet de eliminación.
- `Step2Reference` (`src/components/Step2Reference.tsx`) — el `useEffect` de las líneas 43-47 autocompleta `referencePhoto` con `DEMO_REFERENCE_PHOTO` en cuanto detecta `referencePhoto === null`. Si tras eliminar la foto el estado global vuelve a `null`, este mismo efecto la reemplazaría automáticamente por la foto demo, lo cual no cumpliría el caso borde de H8 ("debe pedirle una nueva foto propia como si fuera la primera vez... bloquea H7"). El componente necesita lógica adicional para distinguir "primera carga de la app" de "foto eliminada explícitamente" antes de decidir si autocompleta con la demo.

## Gaps (componentes que no existen en el DS ni en el repo)
Ninguno fuera del inventario de `DESIGN.md`. El Bottom sheet de acción y el Toast/snackbar ya están definidos en la sección 8.3 del DS; lo que falta es puramente implementación (no existen como archivos reutilizables en `src/components/`), no un gap de diseño.

- **Resolución temporal sugerida**: hasta contar con `BottomSheet.tsx`/`Toast.tsx` genéricos, replicar el patrón visual ya usado por los componentes "Modal" existentes (`CompareModal.tsx`, `SignUpModal.tsx`, `BodyPhotoGuideModal.tsx`, `GarmentPhotoGuideModal.tsx` — todos con overlay `position: 'fixed'` + `justifyContent: 'center'`) pero anclando el contenido al fondo de la pantalla (`justifyContent: 'flex-end'`, radios solo en las esquinas superiores en vez de radios simétricos) para acercarse al comportamiento de un bottom sheet real, y una `View` `position: 'fixed'` angosta con `backgroundColor: '#2B2420'` y texto `#F6F1EA` para el toast.

## Tokens relevantes
- **Colores**: Grafito (`#2B2420`, fondo del toast), Lino (`#F6F1EA`, texto del toast), Piedra (`#75695E`, texto secundario dentro del sheet), Bruma (`#ECE4DA`, superficie del bottom sheet). Ver "Riesgos" sobre qué color usar para la acción destructiva en sí.
- **Spacing**: 20 (margen lateral de pantalla), 16/12 (padding interno del sheet), 8 (gap entre ícono y texto del ítem de acción).
- **Tipografía**: Body M / Botón (sans UI) para el ítem de acción del sheet y para el mensaje del toast — nunca la serifa editorial (Display/H1), porque esto no es un "momento" de marca sino una acción utilitaria recurrente.
- **Radios / sombra**: `radius-md` (14px) en el contenedor del sheet, salvo si se opta por esquinas superiores redondeadas tipo bottom sheet; sombra nivel 2 para el bottom sheet (coincide con la definición de la sección 3.3: "sheet de acción, elemento arrastrado"); sombra nivel 1 o ninguna para el toast, ya que "aparece discreto desde abajo", no elevado como un modal.
- **Movimiento**: entrada/salida del bottom sheet y del toast con el easing por defecto de la sección 6 (`ease-out`, 200-280ms, sin bounce) — no es el "momento coreografiado" que la sección 6 reserva exclusivamente a la revelación del resultado VTON.

## Patrones de interacción
- **Acción destructiva sin confirmación adicional**: se resuelve con el Bottom sheet de acción — el propio ítem dentro del sheet ES la confirmación (un solo tap ejecuta la eliminación), coherente con el criterio de aceptación "no requiere confirmación adicional fuera de la acción misma". No corresponde agregar un segundo paso de "¿estás segura?".
- **Feedback post-eliminación**: Toast/snackbar con mensaje breve y no alarmista (ej. "Tu foto fue eliminada"), que desaparece solo — no corresponde usar el Banner de privacidad para esto, porque ese componente está reservado para mensajes persistentes dentro del flujo, no para confirmaciones temporales.
- **Bloqueo de H7**: al reabrir el flujo de prueba virtual sin foto propia disponible, `Step2Reference` debe volver a su estado vacío inicial (la card de subida/captura, sin foto preseleccionada) en lugar de autocompletar con la foto demo — ver el gap señalado en "Componentes a extender".

## Componentes transversales de esta historia
- Bottom sheet de acción, Toast/snackbar, Botón de ícono circular / Botón terciario (como trigger de apertura del sheet).

## Riesgos / inconsistencias con el DS detectadas
- **Ambigüedad de ubicación**: el PRD no especifica en qué pantalla exacta debe vivir el trigger de esta acción, solo que debe ser "fácil de encontrar, no escondida en un menú de configuración". Este mapeo asume `GuestWardrobePreview` y/o `Step3Result` (o una extensión del `Header` visible en ambas) por ser las pantallas activas "después de ver un resultado", pero es una interpretación de este mapeo, no un dato confirmado del PRD.
- **Modal centrado vs. bottom sheet**: los componentes "Modal" ya existentes en el repo (`CompareModal.tsx`, `SignUpModal.tsx`, `BodyPhotoGuideModal.tsx`, `GarmentPhotoGuideModal.tsx`) están implementados como overlays centrados (`position: 'fixed'`, `justifyContent: 'center'`), no como bottom sheets anclados abajo. Si la acción de H8 se construye reutilizando literalmente ese mismo patrón de "modal centrado" en vez de un verdadero bottom sheet, sería una inconsistencia con la regla del DS que reserva el modal centrado únicamente para lo full-screen bloqueante (ej. resultado VTON, sombra nivel 3) y define el bottom sheet como patrón por defecto para acciones bloqueantes cortas como esta.
- **Color de la acción destructiva**: el DS no define un tratamiento específico para ítems/botones destructivos dentro de un bottom sheet. Usar Ciruela (el acento de marca, reservado para el "wow" del VTON y para 1 acento fuerte por pantalla) en el ítem "Eliminar mi foto" competiría con la regla 80/15/5 y diluiría el significado de ese acento; el semántico de Alerta/Error (`#A85A46`) parece más apropiado en términos de intención, pero `DESIGN.md` no lo define explícitamente para este uso — queda como zona gris a resolver con el equipo de diseño.
- **Cruce con generación en curso**: el caso borde "eliminar la foto mientras se está generando un resultado con esa foto" queda explícitamente sin definir en el propio PRD (ver "Preguntas para PO" en `historias.md`). No hay componente ni patrón de UI que pueda mapearse con confianza para ese caso hasta que el PO lo resuelva.
