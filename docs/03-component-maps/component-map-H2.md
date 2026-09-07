# Component Map: H2 - Ver la transparencia de datos antes de subir la foto propia

## Resumen de la historia

Como usuaria sensible a la privacidad de mi imagen, quiero que se me explique qué se hace con mi foto antes de subirla, para decidir con confianza si quiero continuar.

**Criterios de aceptación funcionales**:
- Antes de que se habilite la carga de la foto propia, se muestra una frase breve que informa: para qué se usa la imagen, cuánto tiempo se conserva, y que no se usa para entrenar modelos de IA.
- Este mensaje aparece en el momento de la carga (no como enlace a una política de privacidad separada).
- La usuaria no puede llegar al selector de foto sin haber visto este mensaje al menos una vez en la sesión.

**Criterios de experiencia**: tono tranquilizador y concreto, no legal ni alarmista; mensaje breve, no interrumpe el impulso de continuar.

**Casos borde**: si la usuaria avanza rápido sin leer, el mensaje debe seguir siendo accesible/revisable antes de confirmar la subida.

**Dependencias**: depende de H1. **Prioridad**: alta (PRD sección 8).

## Pantallas involucradas

- **Subí tu primera foto (con guía así-sí/así-no)** — pantalla del inventario DS (sección 8.5) que corresponde, en el repo real, a `Step2Reference` (`src/components/Step2Reference.tsx`): es la pantalla donde se sube/captura la "foto propia" (foto de referencia de cuerpo).
- No hay una pantalla o paso separado de "transparencia de datos" en `App.tsx` (`src/types.ts` → `OnboardingStep` no incluye un step propio para esto). Actualmente el mensaje de privacidad vive **dentro** de `Step2Reference`, no como gate previo.
- `BodyPhotoGuideModal` (`src/components/BodyPhotoGuideModal.tsx`) es un modal auxiliar de "cómo sacar la foto", accesible desde `Step2Reference`, que también contiene un banner de privacidad al final de su contenido.

## Componentes del DS a usar

- `Step2Reference` (template de pantalla — corresponde a "Subí tu primera foto" del inventario 8.5, ya implementado en el repo) — es la pantalla donde debe resolverse el gate de transparencia antes de habilitar la carga.
- Banner de privacidad (**molécula**, inventario DS 8.2: "ícono + texto explicativo corto + link 'más info', fondo Salvia suave") — ya existe implementado **inline** (no como componente reutilizable propio) en dos lugares del repo:
  - `Step2Reference.tsx`, bloque `privacyBanner` (líneas 343-351, estilos 749-774): ícono `ShieldCheck` (lucide-react) + texto "Esta foto la usamos solo para mostrarte cómo te queda esta prenda. Se borra sola a las 72 horas y nunca se usa para entrenar inteligencia artificial." Fondo `rgba(211, 218, 199, 0.3)` (Salvia suave) + borde Salvia. Cumple el contenido pedido por H2 (uso + retención + no entrenamiento de IA) casi textualmente.
  - `BodyPhotoGuideModal.tsx`, bloque `privacyBanner` (líneas 171-177, estilos 371-386): mismo patrón visual, texto más corto ("Esta foto se borra sola a las 72 horas y nunca se usa para entrenar IA."), sin mencionar "para qué se usa".
- Botón de ícono / botón primario y secundario (**átomos**, ya implementados como `primaryActionButton` "Tomar foto a mi cuerpo" y `secondaryActionButton` "Subir de mi galería" en `Step2Reference.tsx`) — son el "selector de foto" que, según H2, no debería quedar accesible sin que la usuaria haya visto el mensaje.
- Ícono de privacidad/candado (`ShieldCheck`, set de iconografía lineal trazo 1.5px de la sección 4 del DS) — ya en uso.

## Componentes a extender

- **Banner de privacidad** — hoy está implementado dos veces de forma inline (duplicado de estilos y texto entre `Step2Reference.tsx` y `BodyPhotoGuideModal.tsx`) y sin el link "más info" que el inventario DS especifica para esta molécula. Para H2 conviene:
  1. Extraerlo a un componente propio reutilizable (ej. `PrivacyBanner`) que acepte el texto como prop, para no duplicar la especificación entre ambos lugares y para poder reutilizarlo también en el bottom sheet de gate (ver gap más abajo).
  2. Agregarle la variante con link "más info" (tal como lo define el inventario 8.2) que abra/vuelva a mostrar el mensaje completo — esto resuelve directamente el caso borde "el mensaje debe seguir siendo accesible/revisable".
- **`Step2Reference`** — necesita una nueva prop/estado de control (ej. algo como `hasSeenPrivacyNotice`) para condicionar si los botones "Tomar foto a mi cuerpo" / "Subir de mi galería" están habilitados, en vez de estar siempre habilitados como hoy.

## Gaps (componentes que no existen en el DS ni en el repo)

- **Gate de transparencia previo al selector de foto** — H2 pide que la usuaria "no pueda llegar al selector de foto sin haber visto este mensaje al menos una vez en la sesión". Hoy en `Step2Reference.tsx` el banner de privacidad se renderiza *después* del `captureCard` (que ya contiene los botones de captura/subida habilitados sin condición), es decir: es informativo pero **no bloquea nada**. No existe en el repo ni en el inventario DS un componente de "gate"/bloqueo de primer uso con este comportamiento.
  - **Resolución temporal sugerida**: usar el patrón **bottom sheet de acción** (organismo ya definido en el inventario DS 8.3, sombra nivel 2, handle sutil arriba) mostrado automáticamente la primera vez que la usuaria entra a `Step2Reference` en la sesión, con el mismo texto/ícono del banner de privacidad ya existente + un botón primario "Entendido, continuar". Mientras el sheet no fue cerrado, los botones de captura/subida quedan visualmente presentes pero deshabilitados (mismo estilo que `generateButtonDisabled` ya usado más abajo en el propio archivo para el CTA). El estado "visto" se puede persistir en memoria de sesión (ej. `sessionStorage` o estado de `App.tsx`) — no requiere backend.
  - Nota importante de consistencia con el DS: el inventario define el **bottom sheet de acción** como el patrón bloqueante por defecto ("el inventario no define un componente de 'modal' genérico"), pero **ningún modal del repo real usa ese patrón hoy** — `BodyPhotoGuideModal.tsx` (confirmado, backdrop `position: fixed` + `alignItems/justifyContent: center`, sin handle) y `SignUpModal.tsx` (mismo patrón confirmado: backdrop fijo pantalla completa, sin handle de bottom sheet) implementan un modal centrado clásico, no un bottom sheet. Por lo tanto, si se decide resolver el gate de H2 como bottom sheet "de verdad" (deslizando desde abajo, con handle), sería el **primer** componente del repo en seguir ese patrón del DS — ver riesgo relacionado abajo.

## Tokens relevantes

- **Colores**: Salvia suave (fondo del banner de privacidad, ya usado como `rgba(211, 218, 199, 0.3)`), Salvia (ícono `ShieldCheck`, ya usado `#8C9B7E`), Grafito (texto principal del mensaje, `#2B2420`), Piedra (texto secundario/subtítulos), Ciruela (CTA "Entendido, continuar" del gate, si se usa botón primario).
- **Spacing**: 12 (padding del banner, ya usado), 8 (gap ícono-texto), 20 (margen lateral de pantalla, patrón estándar del contenedor `Step2Reference`).
- **Tipografía**: Caption/Body M (sans UI) para el texto del mensaje de transparencia — nunca serifa editorial, porque este es un mensaje funcional recurrente en el flujo, no un "momento" de marca.
- **Radios / sombra**: `radius-md` (14px, ya usado en `privacyBanner`) para el banner; si se implementa como bottom sheet, sombra **nivel 2** (`0px 4px 12px rgba(43,36,32,0.10)`) por ser un elemento de acción elevado, no nivel 3 (reservado para el resultado VTON full-screen).

## Patrones de interacción

- **Bottom sheet de acción**: resuelve el gate bloqueante de H2 (mostrar el mensaje antes de habilitar el selector de foto) — es el patrón que el DS define para contenido bloqueante, en vez de un modal centrado.
- **Banner de privacidad persistente**: resuelve el caso borde de "mensaje revisable" — al quedar visible de forma permanente en `Step2Reference` (como ya ocurre hoy) más un link "más info" que reabre el detalle, la usuaria puede volver a consultarlo sin fricción antes de confirmar la subida.
- **Transición del gate**: al ser un bottom sheet, la sección 6 del DS aplica `ease-out`, 200-280ms de entrada desde abajo — sin bounce, coherente con el resto de transiciones de UI (no es un "momento" de marca como el resultado VTON, así que no amerita coreografía especial).

## Componentes transversales de esta historia

- Banner de privacidad (molécula) — es el componente central de H2, se repite conceptualmente en `Step2Reference` y `BodyPhotoGuideModal`.
- Botón primario/secundario (átomos) — tanto para las acciones de captura/subida que quedan condicionadas por el gate, como para el CTA "Entendido, continuar" del bottom sheet propuesto.

## Riesgos / inconsistencias con el DS detectadas

- **El banner de privacidad actual no bloquea nada**: tal como está implementado hoy en `Step2Reference.tsx`, el mensaje es puramente informativo y se ubica *debajo* de los botones de acción ya habilitados. Esto no cumple el criterio funcional de H2 ("la usuaria no puede llegar al selector de foto sin haber visto este mensaje"). Es la brecha principal que este mapeo señala, no solo una inconsistencia visual.
- **Modal centrado vs. bottom sheet**: el DS establece explícitamente que el patrón bloqueante del sistema es el bottom sheet de acción, no un modal genérico centrado. Sin embargo, todos los modales confirmados en el repo (`BodyPhotoGuideModal`, `SignUpModal`) usan un patrón de modal centrado con backdrop fijo. Si el gate de H2 se resuelve con un bottom sheet real, sería inconsistente en su forma con el resto de los overlays existentes del producto — vale la pena decidir explícitamente si se corrige solo este caso o se migra el patrón de modales del repo en conjunto (fuera del alcance de H2 por sí sola).
- **Duplicación de texto/estilos del banner de privacidad**: el texto y los estilos del banner difieren levemente entre `Step2Reference.tsx` y `BodyPhotoGuideModal.tsx` (uno menciona "para qué se usa" y el otro no), lo cual es exactamente el tipo de inconsistencia que H2 busca evitar (transparencia clara y consistente). Se resuelve unificando en un solo componente reutilizable, como se sugiere en "Componentes a extender".
