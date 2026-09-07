# Content System — "Placard"
### Voz, tono y microcopy para la app de moda con VTON

> Complementa a `DESIGN.md`. Mientras ese documento define cómo se ve la app, este define **cómo le habla a la usuaria**. Está basado directamente en la investigación de Camila (arquetipo) y en los requisitos de confianza/privacidad del PRD — no es una guía de estilo genérica.

---

## 0. De dónde sale cada regla

Cada principio de este documento está anclado a algo que dijo o vivió Camila, para que no se lea como una guía de tono inventada:

| Principio | Evidencia que lo sostiene |
|---|---|
| Cercano y cálido, nunca clínico | Camila resuelve el problema hoy pidiéndole la opinión a su hermana por WhatsApp — el punto de comparación no es una app, es una persona de confianza. |
| Nunca obligar, siempre sugerir | 65% de abandono en apps competidoras viene de exigirle cosas a la usuaria antes de darle valor. Pedir/exigir es literalmente lo que hace que la gente se vaya. |
| Feedback del resultado, sin estándares rígidos | "Necesito pensar qué me quiero poner... así no piojo el placard" — Camila ya se autoexige mucho; la app no debe sumar otra vara de exigencia sobre cómo se ve. |
| Personalización con nombre | Camila no es early adopter de tecnología — la personalización compensa la distancia inicial con "esto no es una herramienta genérica, es para vos". |
| Transparencia explícita, en lenguaje simple | El PRD (F3) exige comunicar qué pasa con la foto en el momento de subida, en una frase, no en una política. Esto es tono además de función: tiene que sonar a que alguien te lo explica, no a legal copy. |
| Nunca hacer sentir mal por una foto imperfecta | Riesgo #1 del PRD: la degradación de calidad con fotos caseras puede romper la confianza. El copy tiene que absorber esa imperfección sin que se sienta un fracaso de la usuaria. |
| Sin presión de upgrade | El PRD es explícito: el límite gratuito debe ser generoso y la monetización es una señal a observar, no un objetivo agresivo. El copy de upgrade nunca debe sonar a paywall agresivo. |

---

## 1. Principios de voz (los 5 no negociables)

1. **Cercana, no corporativa** — le habla como una amiga con buen ojo, no como una app de servicio al cliente. Si una frase podría estar en el mail de confirmación de un banco, está mal.
2. **Cálida, no efusiva** — calidez no es signos de exclamación ni superlativos. Es elegir la palabra que se siente humana en vez de la que se siente automatizada.
3. **Informal pero clara** — voseo rioplatense (vos, tenés, subí, mirá), lenguaje cotidiano de Buenos Aires. Informal no significa impreciso: la claridad nunca se sacrifica por sonar copada.
4. **Nunca prescriptiva** — todo verbo de acción hacia la usuaria es una sugerencia, nunca una orden. Se sugiere, se propone, se invita — no se manda.
5. **Personalizada** — el sistema sabe el nombre de la usuaria y lo usa con criterio (ver sección 3), no lo estampa en cada oración.

---

## 2. Reglas gramaticales y de forma

- **Voseo rioplatense siempre**: "vos podés", "subí", "mirá", "tenés". Nunca tuteo ("tú puedes") ni "ustedes" formal.
- **Sentence case**, nunca mayúsculas sostenidas ni Title Case en botones/labels (coherente con `DESIGN.md`).
- **Sin puntuación de cierre en labels y botones** ("Guardar en tu placard", no "Guardar en tu placard."). Los mensajes conversacionales sí llevan punto final.
- **Signos de exclamación: máximo uno por pantalla, y solo cuando el momento lo amerita** (el resultado del VTON, un logro). Nunca en errores, nunca en mensajes de privacidad, nunca en más de una frase seguida.
- **Sin emojis** en la interfaz — la calidez se construye con elección de palabras, no con íconos gráficos adicionales (mantiene la sutileza del sistema visual).
- **Frases cortas.** Si una oración necesita coma y subordinada, probablemente son dos oraciones.
- **Nunca "por favor"** en instrucciones funcionales ("Subí una foto", no "Por favor, subí una foto") — la cercanía no necesita formalidad; pedir permiso todo el tiempo genera distancia, no calidez.

---

## 3. Personalización con nombre — cuándo sí, cuándo no

El nombre es una herramienta de calidez, no un truco de marketing. Usarlo en todos lados lo vacía de sentido.

**Usar el nombre en:**
- El primer saludo de la sesión del día ("Hola, Camila").
- El momento del resultado (el instante hero): "Así te queda, Camila" o similar.
- Mensajes de reconocimiento de uso recurrente ("Van 3 looks esta semana, Camila — se nota que le encontraste la vuelta").
- Comunicaciones fuera de la app (notificaciones push, mail) — ahí el nombre hace más trabajo porque compite con más ruido.

**No usar el nombre en:**
- Microcopy funcional recurrente (botones, labels, estados de carga) — sonaría forzado si cada pantalla dice "Camila" en algún lado.
- Mensajes de error o fricción (foto de mala calidad, límite alcanzado) — en esos momentos el nombre puede sentirse casi irónico ("Uy, Camila, tu foto...") en vez de empático. Ahí priorizar tono suave sin nombre.
- Más de una vez por pantalla.

**Fallback sin nombre:** si el sistema no tiene el nombre todavía (primera pantalla de onboarding, antes de cualquier dato), usar "vos" como sujeto implícito — nunca "el usuario" ni placeholders visibles tipo "Hola, [Usuario]".

---

## 4. Vocabulario — usar / evitar

| Usar | Evitar | Por qué |
|---|---|---|
| "Subí una foto" | "Cargá tu placard" | "Cargar el placard" es exactamente la fricción que hizo abandonar al 65% de los usuarios de la competencia — ni en broma se usa ese verbo. |
| "Así te queda" / "Así se ve" | "Resultado generado" / "Output del modelo" | Lenguaje de producto de IA rompe la cercanía; nadie le dice a una amiga "output del modelo". |
| "Probá otra prenda" | "Agregá un ítem" | "Ítem" es vocabulario de catálogo, no de placard personal. |
| "Guardalo si te gusta" | "Confirmar" / "Aceptar" | Son verbos de formulario, no de una decisión sobre cómo te queda algo puesto. |
| "Se ve un poco oscura la foto, ¿la sacamos de nuevo?" | "Foto inválida" / "Error de calidad" | Nunca "error" cuando el problema es de luz o encuadre — no es un error de la usuaria, es una sugerencia de mejora. |
| "Tu foto se borra en 72 horas y no se usa para entrenar IA" | "Consultá nuestra política de privacidad" | El PRD exige la explicación en el momento, en una frase — nunca derivar a un documento legal en el momento de la carga. |
| "Llegaste a tus 5 looks de la semana" | "Alcanzaste el límite de tu plan" | "Límite" suena a restricción punitiva; reformular como logro/conteo natural, no como un freno. |
| "Si querés seguir probando, podés pasarte al plan con más looks" | "Actualizá tu plan para continuar" | Nunca bloquear el tono con un imperativo de conversión — se ofrece, no se exige. |
| "no está mal, pero..." / "podría..." | "deberías", "tenés que", "hay que" | Cualquier verbo de obligación queda prohibido en copy dirigido a la usuaria (ver sección 5). |

---

## 5. La regla de "sugerir, nunca obligar" — aplicación práctica

Ningún mensaje de la app usa estructuras de mandato. Se reemplazan sistemáticamente:

| En vez de (mandato) | Se escribe (sugerencia) |
|---|---|
| "Sacá una foto con mejor luz" | "Con un poco más de luz seguro sale mejor — ¿probamos de nuevo?" |
| "Completá tu perfil" | "Cuando quieras, podés sumar más datos a tu perfil" |
| "Debés registrarte para guardar este look" | "Si querés guardar este look para más adelante, te podés registrar — es opcional" |
| "Elegí una ocasión" | "Si querés, le podés poner una etiqueta (trabajo, salida, viaje...)" |
| "Actualizá la app" | "Hay una versión nueva disponible, cuando puedas" |

**Patrón general**: condicional ("si querés", "cuando quieras", "podés") + la acción como opción, nunca como paso obligatorio del flujo. Incluso los CTAs primarios se redactan como invitación ("Ver cómo te queda") en vez de instrucción seca ("Continuar").

---

## 6. Feedback del look generado — el corazón del content system

Este es el momento más sensible de toda la app: la usuaria está viendo una imagen de su propio cuerpo generada por IA. El copy alrededor de ese momento tiene una sola función — **acompañar sin evaluar**.

### 6.1 Reglas específicas para este momento

- **La app nunca opina sobre cómo le queda la prenda a la usuaria.** No dice "te queda genial", "no es tu mejor look", ni nada que implique un juicio estético sobre su cuerpo o su elección. Eso es literalmente lo que Camila le pide a su hermana — no es el rol de la app reemplazar esa opinión humana con una automatizada y potencialmente vacía.
- El copy describe **el resultado técnico** (que la imagen esté lista, que se generó bien) y **abre la puerta a que ella decida**, nunca decide por ella.
- Cuando el resultado puede ser impreciso (foto casera, mala luz), el copy **setea expectativa antes**, nunca "explica" después con excusas — evita que la usuaria sienta que el problema es de ella.
- Nada de rankings, puntajes ni "compatibilidad" numérica entre prenda y usuaria — no hay estándar de belleza codificado en el producto.

### 6.2 Banco de frases para el momento de resultado (rotar, no repetir siempre la misma)

Título/hero (con serifa, momento de mayor peso):
- "Así te queda"
- "Así se ve puesto"
- "Tu prueba está lista"

Texto de acompañamiento (sans, debajo, tono conversacional — elegir una, nunca combinar dos):
- "¿Qué te parece? Vos decidís si va."
- "Guardalo si te copa, o probamos con otra prenda."
- "Fijate cómo se ve y decidís con calma."

**Nunca usar** en este bloque: "perfecto", "ideal", "te favorece", "combina bien con vos" (evaluación estética) — esas frases sí están permitidas cuando hablan de **la combinación entre dos prendas** (ver 6.3), pero no cuando hablan del cuerpo o imagen de la usuaria.

### 6.3 Feedback sobre combinaciones de prendas (distinto del feedback sobre la persona)

Acá sí se puede sugerir con más soltura, porque es una observación sobre las prendas, no sobre el cuerpo:
- "Esto combina bien con el blazer beige que ya tenés"
- "Nunca la probaste con el jean claro — capaz vale la pena"
- "Se parece bastante al look que guardaste la semana pasada"

Siempre en tono de sugerencia liviana, nunca de instrucción de estilo ("deberías combinarlo con...").

### 6.4 Cuando la calidad de la foto es baja (antes de generar)

- "Esta foto tiene poca luz — el resultado puede no salir tan parecido a vos. ¿Probamos con otra?"
- "Che, se te corta un poco el cuerpo en el encuadre. Con un pasito para atrás debería andar mejor."

Estructura fija: **observación neutra + consecuencia honesta (sin dramatizar) + invitación a reintentar**, nunca "foto rechazada" ni "error".

---

## 7. Privacidad y transparencia (F3 del PRD)

El PRD exige explicar en una frase, en el momento de subida, qué pasa con la foto. El tono acá es **directo y tranquilizador**, sin sonar a letra chica ni a advertencia legal:

- "Esta foto la usamos solo para mostrarte cómo te queda esta prenda. Se borra sola a las 72 horas y nunca se usa para entrenar inteligencia artificial."
- Botón de acción relacionado: "Eliminar mi foto ahora" (siempre disponible, nunca escondido en configuración — el copy del botón es literal, sin eufemismos).

Evitar: "tus datos", "procesamos tu información" (lenguaje de política de privacidad) — se habla siempre de "tu foto", concreto y personal, no de "datos".

---

## 8. Freemium / upgrade — nunca presión, siempre información + opción

Según el PRD, el límite gratuito es generoso a propósito, y la monetización es una señal a observar, no un objetivo a empujar agresivamente. El copy tiene que sonar a información, no a paywall.

### 8.1 Al alcanzar el límite gratuito

- Título: "Llegaste a tus 5 looks de la semana"
- Cuerpo: "Podés seguir la semana que viene sin hacer nada, o si querés seguir probando ahora, hay un plan con más lugar."
- CTA primario (secundario en jerarquía visual, nunca el único camino): "Ver el plan con más looks"
- CTA de salida, igual de visible: "Está bien, espero a la semana que viene"

**Regla dura**: siempre tiene que existir, con el mismo peso visual y de tono, una salida gratuita sin fricción — nunca un mensaje que solo ofrezca pagar.

### 8.2 Al querer sacar la marca de agua / acceder a un resultado viejo

- "Este look ya pasó su tiempo de guardado gratuito. Si querés tenerlo siempre a mano, es parte del plan con más beneficios."

Nunca: "Actualizá para desbloquear" (lenguaje de feature-gating agresivo).

---

## 9. Estados de espera y carga

Ligado a la identidad textil del sistema visual (loader tipo percha/doblado de tela, nunca spinner genérico), el copy de espera evita tecnicismos:

- "Viendo cómo te queda..."
- "Un segundo, estamos probándotelo..."
- "Ya casi..."

Nunca: "Procesando...", "Cargando modelo...", "Generando imagen con IA..." (rompe la ilusión de cercanía con lenguaje de sistema).

---

## 10. Estados vacíos

Tono de invitación cálida, nunca de carencia:

- Placard vacío: "Todavía no tenés prendas acá. Empezamos con una foto — no hace falta cargar todo de una."
- Galería de looks vacía: "Tus looks van a aparecer acá apenas pruebes el primero."
- Favoritos vacíos: "Marcá con el corazón los looks que más te gustaron para encontrarlos rápido después."

Nunca "No hay resultados" ni "Lista vacía" — siempre orientado a la próxima acción posible, en tono opcional.

---

## 11. Notificaciones push (fuera de la app)

Con nombre cuando corresponde (ver sección 3), tono cercano, sin urgencia artificial:

- "Camila, ¿ya sabés qué te vas a poner mañana? Probalo antes de salir."
- "Van 3 looks esta semana — se nota que le encontraste la vuelta al placard."

Evitar: signos de exclamación múltiples, "¡No te lo pierdas!", cualquier lenguaje de urgencia o FOMO — no es el tono de la marca ni el problema que Camila necesita resolver (ella ya tiene bastante ansiedad, la app no debe sumar más).

---

## 12. Checklist rápido antes de publicar cualquier copy nuevo

- [ ] ¿Usa voseo rioplatense?
- [ ] ¿Algún verbo suena a orden en vez de sugerencia? → reformular con "si querés" / "podés" / condicional.
- [ ] Si es sobre el resultado del VTON, ¿evalúa el cuerpo o apariencia de la usuaria? → eliminar cualquier juicio estético.
- [ ] Si es un mensaje de fricción (foto mala, límite alcanzado), ¿existe una salida sin culpa y sin pagar?
- [ ] ¿El nombre aparece más de una vez en la misma pantalla? → sacar la repetición.
- [ ] ¿Hay lenguaje de sistema/IA ("procesando", "modelo", "output")? → reemplazar por lenguaje cotidiano.
- [ ] ¿Suena a algo que le diría una amiga con buen ojo, o a algo que diría un formulario?
