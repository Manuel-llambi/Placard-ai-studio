# Sistema de Diseño — "Placard" (nombre provisorio)
### App mobile de moda, placard digital y prueba virtual (VTON)

> Basado en Atomic Design. Este documento define únicamente las especificaciones **visuales** del sistema (color, tipografía, espaciado, forma, iconografía, imagen, movimiento) y el inventario de componentes por nivel atómico. No incluye código: está pensado para implementarse en cualquier plataforma (iOS, Android, Web).

---

## 0. Personalidad de marca

El sistema debe sentirse como **el placard de una amiga con buen ojo**, no como una app de productividad ni como una vidriera de shopping. Cuatro principios rectores, derivados directamente del arquetipo de Camila:

| Principio | Qué significa visualmente | Qué evitamos |
|---|---|---|
| **Personalización** | La foto y las prendas reales de la usuria son siempre protagonistas; la UI se retira para dejarlas ver. El core del producto es visual: la Home es un feed de imágenes (fotos subidas + resultados VTON generados), no una lista o un catálogo. | Ilustraciones o mockups genéricos de "modelos" que reemplacen el contenido real. Chrome de UI que compita en tamaño o color con la imagen. |
| **Sutileza** | Paleta de baja saturación, contrastes suaves, jerarquía por peso y espacio antes que por color. | Acentos neón, gradientes decorativos, badges gritones. |
| **Elegancia cotidiana** | Un lujo silencioso y usable a las 7:45 PM con el celular en la mano, no una editorial de moda inalcanzable. | Serifas ultra-display, mucho dorado, texturas "premium" pesadas. |
| **Expresividad** | Un solo momento de color/movimiento con fuerza por pantalla (el resultado del VTON, el "match" del outfit). | Decoración repetida en cada card; todo compitiendo por atención. |

**Tono opuesto a evitar activamente:** el look "app de fitness/productividad" (grises fríos, azules corporativos, iconografía geométrica dura) y el look "app de shopping fast-fashion" (rosa chicle, tipografías bold gruesas, todo en mayúsculas, urgencia visual).

---

## 1. Paleta de color

Paleta inspirada en materiales reales del universo de Camila: lino, papel de revista, cuero envejecido, ciruela, salvia seca. Baja saturación general (todos los tonos están "empolvados", nunca puros) para que se sienta liviana de mirar durante uso frecuente (3-4 veces por semana).

### 1.1 Base / superficies

| Nombre | Hex | Uso |
|---|---|---|
| **Lino** | `#F6F1EA` | Fondo primario de la app (reemplaza al blanco puro). Cálido, papel natural. |
| **Bruma** | `#ECE4DA` | Superficie secundaria: cards, inputs, fondos de sheets/modales. |
| **Niebla** | `#DCD2C4` | Bordes, separadores, estado disabled de superficies. |

### 1.2 Texto / tinta

| Nombre | Hex | Uso |
|---|---|---|
| **Grafito** | `#2B2420` | Texto principal, íconos activos. Negro cálido, nunca `#000000` puro. |
| **Piedra** | `#75695E` | Texto secundario, metadata, placeholders, labels. |
| **Piedra clara** | `#A79C8E` | Texto terciario / deshabilitado / captions de menor jerarquía. |

### 1.3 Acento primario — Ciruela

| Nombre | Hex | Uso |
|---|---|---|
| **Ciruela** | `#7A4655` | Color de marca. CTAs principales, selección activa, ícono de "favorito", el momento "wow" del resultado VTON. Úsalo con moderación: 1 acento fuerte por pantalla. |
| **Ciruela suave** | `#C6A2AC` | Variante tenue del acento: fondos de chips seleccionados, estados hover/pressed, ilustraciones de onboarding. |

### 1.4 Acento secundario — Salvia

| Nombre | Hex | Uso |
|---|---|---|
| **Salvia** | `#8C9B7E` | Segundo acento: confirmaciones suaves, tags de "combina bien", indicadores de privacidad/seguridad, estado "guardado en el placard". |
| **Salvia suave** | `#D3DAC7` | Fondos de badges de éxito, fondos de tooltips informativos. |

### 1.5 Acento terciario — Bronce (uso muy escaso)

| Nombre | Hex | Uso |
|---|---|---|
| **Bronce** | `#AD8A56` | Detalle premium/expresivo: borde de una card destacada, ícono de función paga, micro-detalle en el momento de "match perfecto". Nunca como color de fondo grande. |

### 1.6 Semánticos (misma familia tonal, no colores de sistema genéricos)

| Estado | Hex | Nota |
|---|---|---|
| Éxito | `#8C9B7E` (Salvia) | Reutiliza el acento secundario. |
| Alerta / error | `#A85A46` | "Terracota quemada" — más apagado que un rojo de sistema, coherente con la paleta. |
| Información | `#748493` | "Azul piedra" desaturado, para banners de privacidad y explicaciones. |

### 1.7 Reglas de uso de color

- **Regla 80/15/5**: 80% de cada pantalla en Lino/Bruma/Grafito (neutros), 15% en el acento que corresponda a la función de esa pantalla, 5% en Bronce o color secundario.
- El color nunca es el único portador de significado (acompañar siempre con forma, ícono o texto) — clave para accesibilidad.
- Las fotos y prendas de la usuaria son la fuente de color más fuerte de la pantalla; la UI siempre queda tonalmente por detrás.

---

## 2. Tipografía

Dos familias, roles claramente distintos: una serifa editorial con carácter para momentos de marca, y una humanista sans para toda la interfaz funcional (debe leerse perfecto a las 7:45 PM, cansada, en un celular).

| Rol | Familia sugerida | Personalidad | Dónde se usa |
|---|---|---|---|
| **Display / editorial** | Serifa contemporánea de trazo suave y contraste bajo-medio (ej. familia estilo *Fraunces*, óptica "soft") | Cálida, con carácter, ligeramente imperfecta — como una tipografía de revista independiente, no de lujo frío | Títulos de sección, nombre del outfit generado, pantallas de onboarding, momento del resultado VTON |
| **UI / cuerpo** | Sans humanista geométrica (ej. familia estilo *General Sans*) | Neutra, cálida, muy legible en tamaños chicos | Navegación, botones, inputs, metadata, todo el copy funcional |

### 2.1 Escala tipográfica (mobile, base 16px / 1rem)

| Token | Tamaño | Peso | Familia | Uso |
|---|---|---|---|---|
| Display | 32px / línea 38px | Regular/Medium | Serifa editorial | Título de resultado VTON, hero de onboarding |
| H1 | 26px / línea 32px | Medium | Serifa editorial | Título de pantalla principal |
| H2 | 20px / línea 26px | Medium | Sans UI | Encabezado de sección (ej. "Tus últimos looks") |
| H3 | 17px / línea 22px | Medium | Sans UI | Subtítulos, títulos de card |
| Body L | 16px / línea 24px | Regular | Sans UI | Texto de lectura principal |
| Body M | 14px / línea 20px | Regular | Sans UI | Texto estándar de UI, listas |
| Caption | 12px / línea 16px | Regular/Medium | Sans UI | Metadata, timestamps, ayudas contextuales |
| Botón | 15px / línea 20px | Medium | Sans UI | Texto de botones y acciones |

### 2.2 Reglas tipográficas
  
- Sin versalitas ni mayúsculas sostenidas para labels (rompe la sutileza buscada); usar case de oración.
- Nunca más de 2 pesos por pantalla (Regular + Medium alcanza casi siempre).
- Line-length de texto de lectura: 55–65 caracteres incluso en mobile (usar padding generoso antes que texto edge-to-edge).
- La serifa editorial se reserva para **momentos**, no para UI recurrente — si se usa en cada card, pierde su función de "evento especial".

---

## 3. Espaciado, grilla y forma

### 3.1 Grilla base

- Unidad base: **4px**. Escala: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64.
- Margen lateral de pantalla: **20px** (no 16px — da un poco más de aire, refuerza la sensación "liviana").
- Grilla de contenido: columnas fluidas con gutter de 8–12px.
- **Patrón único de contenido visual: masonry de 2 columnas** (alturas variables, estilo Pinterest/Instagram). Se usa tanto en "Tus looks" (fotos y resultados VTON) como en "Tu placard" (fotos de prendas sueltas) — mantener el mismo lenguaje de grilla entre ambas secciones del navbar inferior refuerza que son dos vistas del mismo sistema de fotos, no dos productos distintos. Nunca 3+ columnas — con 2 columnas cada imagen conserva tamaño suficiente para leerse como fotografía, no como ícono.
- El grid parejo (mismo alto de card) queda reservado únicamente para vistas de selección dentro de un flujo (ej. elegir una prenda al construir un outfit), no para las pantallas principales de navegación.

### 3.2 Radios de borde (escala deliberada, no un único radio para todo)

| Token | Valor | Uso |
|---|---|---|
| `radius-sm` | 8px | Inputs, chips rectangulares, botones pequeños |
| `radius-md` | 14px | Botones principales, cards de UI (banners, tarjetas de privacidad) |
| `radius-lg` | 20px | Cards de prenda / outfit — el contenedor "importante" |
| `radius-full` | 999px | Chips de filtro tipo pill, avatar, badges |

La diferencia entre radios comunica jerarquía: las prendas (el contenido real) tienen el radio más grande y suave; la "maquinaria" de UI (inputs, botones utilitarios) usa radios más chicos y contenidos.

### 3.3 Elevación / sombra

Sombras cálidas y muy sutiles — nunca gris frío puro (`rgba(0,0,0,.1)` estándar), sino con un tinte del Grafito.

| Nivel | Sombra | Uso |
|---|---|---|
| 0 | ninguna | Fondos, superficies planas |
| 1 | `0px 1px 2px rgba(43,36,32,0.06)` | Cards en reposo dentro del grid del placard |
| 2 | `0px 4px 12px rgba(43,36,32,0.10)` | Cards elevadas: sheet de acción, elemento arrastrado |
| 3 | `0px 12px 32px rgba(43,36,32,0.16)` | Modal, resultado VTON en pantalla completa, momento hero |

---

## 4. Iconografía

- Estilo **lineal, trazo 1.5px, terminaciones redondeadas** — coherente con la calidez de la tipografía sans.
- Sin iconografía geométrica dura ni esquinas filosas (evitar el lenguaje visual "fitness tracker").
- Estado activo: el ícono cambia de línea a versión con relleno suave en Ciruela, no solo cambia de color.
- Set de íconos propios recomendado para: placard, cámara/upload, favorito (corazón trazo fino), compartir, privacidad/candado, prenda individual, outfit (conjunto), calendario de looks, perfil.
- Tamaño estándar: 24px en navegación, 20px inline con texto, 32px en estados vacíos/ilustrativos.

---

## 5. Imagen y fotografía

Este es el eje visual más importante del producto, porque el contenido central son fotos reales de la usuaria y sus prendas.

- **Dirección de arte**: luz natural, tonos cálidos, imperfección real — nunca fotografía de stock de moda perfectamente iluminada. El sistema debe verse bien con una selfie de espejo de baño, no solo con fotos de estudio.
- **Tratamiento de imagen en cards**: sin overlays de color sobre las fotos; si se necesita texto sobre imagen, usar un scrim sutil en gradiente de Grafito al 0–40% de opacidad, nunca un color de marca.
- **Guías de captura (para el onboarding de foto)**: mostrar par de ejemplos "así sí / así no" con foco en luz, encuadre de cuerpo y fondo neutro — comunicado con fotografía real, no íconos abstractos.
- **Resultado VTON**: es el momento "hero" de expresividad de toda la app — la única pantalla donde se permite una transición más notoria y el uso más fuerte del acento Ciruela (ej. un halo o borde sutil alrededor de la imagen resultado).
- **Feed de looks / placard (ambos masonry)**: cada celda es full-bleed (la foto llega hasta el borde de la card, sin padding interno ni marco blanco). El único chrome permitido sobre la imagen es: en "Looks", un ícono de guardado en la esquina superior; en "Placard", el nombre y categoría de la prenda como label. Ambos usan un scrim de gradiente Grafito 0→45-55% solo en el cuarto inferior de la imagen — nunca una barra de texto sólida. La card en sí no lleva borde ni sombra fuerte: el límite entre imagen y fondo Lino ya es suficiente contraste.
- El radio de las celdas masonry es `radius-lg` (20px) en ambas secciones, igual que las cards de prenda — mantiene un único lenguaje de "contenedor de imagen" en toda la app.

---

## 6. Movimiento

- Easing por defecto: salida suave, sin rebote agresivo — `ease-out`, 200–280ms para transiciones de UI.
- **Un solo momento coreografiado por flujo**: la revelación del resultado VTON (fade + leve escala desde 0.96 a 1.0) es el instante de movimiento con más personalidad de todo el sistema. El resto de la interfaz se mueve de forma discreta.
- Selección de prenda/outfit: micro-transición de escala (0.98) al presionar, sin bounce.
- Se respeta *reduced motion*: toda animación decorativa tiene alternativa estática (crossfade simple).
- Loaders: nunca un spinner circular genérico — usar una animación sutil tipo "percha balanceándose" o barra de progreso lineal en Ciruela suave, reforzando la identidad textil del producto.

---

## 7. Accesibilidad (piso no negociable)

- Contraste texto/fondo mínimo AA: Grafito sobre Lino cumple holgadamente; verificar Piedra sobre Bruma en textos chicos (usar Piedra solo desde Body M en adelante, nunca en Caption sobre Bruma).
- Área táctil mínima: 44×44px en todo elemento interactivo.
- El color nunca es el único indicador de estado (ver regla en sección 1.7).
- Tipografía debe soportar *dynamic type* / escalado del sistema sin romper layout de cards.

---

## 8. Inventario de componentes (Atomic Design)

### 8.1 Átomos

- Tokens de color (paleta completa de la sección 1)
- Tokens de tipografía (escala de la sección 2)
- Botón primario (fondo Ciruela, texto Lino)
- Botón secundario (borde Grafito 1px, fondo transparente)
- Botón terciario / texto (solo texto, subrayado sutil en hover/press)
- Botón de ícono circular (fondo Bruma, ícono Grafito)
- Campo de texto (fondo Bruma, radius-sm, label flotante en Piedra)
- Chip de filtro (pill, estado inactivo en Bruma / activo en Ciruela suave)
- Swatch de color de prenda (círculo pequeño, borde Niebla)
- Toggle / switch (riel en Niebla, thumb en Lino, activo en Salvia)
- Checkbox y radio button (trazo Grafito, check en Ciruela)
- Avatar circular (foto de usuaria, borde 2px Lino con sombra nivel 1)
- Badge de privacidad (ícono candado + texto Caption, fondo Salvia suave)
- Badge premium (ícono + borde Bronce, fondo Lino)
- Divider (línea 1px Niebla)
- Spinner/loader de marca (ver sección 6)
- Thumbnail de prenda (imagen recortada, radius-lg, sombra nivel 1)
- Celda de feed full-bleed (imagen sin padding interno, radius-lg, sin borde — ver sección 5)

### 8.2 Moléculas

- Barra de búsqueda (input + ícono lupa + botón de filtro)
- Card de prenda de placard (thumbnail + nombre + swatch de color + ícono favorito)
- Card de combinación/outfit (2–4 thumbnails compuestos + label + badge "combina bien")
- Card de subida/captura (zona punteada con ícono cámara + texto de guía)
- Banner de privacidad (ícono + texto explicativo corto + link "más info", fondo Salvia suave)
- Indicador de calidad de foto (ícono + mensaje: "Buena luz ✓" / "Poca luz, ¿otra foto?")
- Grupo de chips de filtro (categoría, ocasión, color)
- **Selector de sección con chips horizontales** (tabs con scroll, primer chip siempre "Todo/Todos" activo por defecto): en Placard filtra por tipo de prenda (Remeras, Pantalones, Vestidos...) con contador; en Looks filtra por ocasión (Trabajo, Finde, Guardados). Misma molécula, distinto set de datos — refuerza la coherencia entre ambos tabs del navbar.
- **Contador de categoría** (label + número entre paréntesis, ej. "Remeras (12)") — metadata que ayuda a que la usuaria sepa qué tan lleno está cada rubro sin abrirlo
- Ítem de lista de placard (thumbnail chico + nombre + metadata + chevron)
- Stepper de onboarding (puntos + indicador activo en Ciruela)
- Overlay comparativo "foto así / así no" (dos miniaturas lado a lado con check/cruz)
- Ítem de navegación inferior (ícono + label, estado activo con relleno)
- Header de pantalla (título H1 serifa + acción a la derecha, opcional)

### 8.3 Organismos

- **Feed de looks (masonry)**: grid de 2 columnas con alturas variables; cada celda una foto real (subida, resultado VTON o combinación guardada); scroll vertical infinito; estado vacío incluido.
- **Grid de placard (masonry)**: mismo patrón de grilla que el feed de looks, pero cada celda es una prenda suelta fotografiada, con label de nombre + categoría sobre scrim; incluye selector de categoría horizontal arriba (Todo, Remeras, Pantalones, etc. con contador) para filtrar el masonry; scroll vertical, estado vacío por categoría incluido.
- Visor de resultado VTON (imagen a pantalla completa + slider antes/después + acciones: guardar, compartir, reintentar)
- Carrusel de onboarding (3–4 pantallas con ilustración/foto + texto + CTA)
- **Barra de navegación inferior**: dos tabs principales, **Looks** y **Placard** (ambos llevan a una vista masonry — ver arriba), con el botón circular de cámara en Ciruela elevado entre ambos como acción primaria de "generar" (patrón Instagram/TikTok "+"). El ícono y label activos cambian de Piedra clara a Ciruela según la sección.
- Bottom sheet de acción (ej. "Eliminar foto", "Compartir look") con handle sutil arriba
- Constructor de outfit (canvas con prendas seleccionables + panel de sugeridas)
- Estado vacío ilustrado (placard vacío, primer uso, con CTA claro y cálido)
- Toast/snackbar (fondo Grafito, texto Lino, aparición discreta desde abajo)
- Header de perfil (avatar + nombre + resumen de placard: cantidad de prendas, outfits guardados)
- Pantalla de captura de cámara (viewfinder + guía de encuadre + botón de disparo en Ciruela)

### 8.4 Templates

- Template de onboarding (carrusel → primera foto → primer VTON, sin pedir registro)
- **Template de Looks (header "Tus looks" + chips de ocasión + feed masonry + navegación inferior)** — tab principal del navbar
- **Template de Placard (header "Tu placard" + chips de categoría con contador + grid masonry + navegación inferior)** — segundo tab principal del navbar, mismo patrón visual que Looks
- Template de flujo de prueba virtual (subida de prenda → loader de marca → resultado)
- Template de detalle de prenda/outfit (imagen grande + metadata + acciones)
- Template de configuración/privacidad (lista de ítems + banner explicativo + control de borrado de fotos)

### 8.5 Pantallas (ejemplos de página)

- Bienvenida / propuesta de valor (Formulación B, tono emocional)
- Subí tu primera foto (con guía así-sí/así-no)
- Tu primer resultado (momento hero, máxima expresividad)
- Tus looks (tab principal, feed masonry)
- Tu placard (tab principal, grid masonry categorizado)
- Detalle de prenda
- Probador virtual — cámara/selección de prenda
- Resultado de prueba — comparar y guardar
- Sugerencias de outfit para mañana
- Perfil y privacidad (foto: cuándo se borra, botón eliminar)

---

## 9. Resumen de tokens (referencia rápida)

```
COLOR
  lino           #F6F1EA
  bruma          #ECE4DA
  niebla         #DCD2C4
  grafito        #2B2420
  piedra         #75695E
  piedra-clara   #A79C8E
  ciruela        #7A4655
  ciruela-suave  #C6A2AC
  salvia         #8C9B7E
  salvia-suave   #D3DAC7
  bronce         #AD8A56
  error          #A85A46
  info           #748493

RADIUS
  sm   8px
  md   14px
  lg   20px
  full 999px

ESPACIADO
  4 · 8 · 12 · 16 · 24 · 32 · 48 · 64

TIPOGRAFÍA
  display  serifa editorial   32/38  medium
  h1       serifa editorial   26/32  medium
  h2       sans ui            20/26  medium
  h3       sans ui            17/22  medium
  body-l   sans ui            16/24  regular
  body-m   sans ui            14/20  regular
  caption  sans ui            12/16  regular
  boton    sans ui            15/20  medium
```
