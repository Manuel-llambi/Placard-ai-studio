# PRD — Placard Digital con VTON (MVP)

**Versión:** 2.0 — MVP reducido al loop de valor central
**Estado:** Draft para desarrollo — pendiente validación de concierge test
**Alcance de este documento:** Funcional. No incluye especificaciones de UI ni de implementación técnica/código.

---

## 1. Resumen ejecutivo

Primera versión del producto de placard digital centrado en **Virtual Try-On (VTON) foto-a-foto**. Este MVP se acota deliberadamente a un único flujo: el usuario sube una foto propia y una foto de una prenda que ya tiene, sin fricción de registro ni pasos intermedios, y el sistema genera una imagen mostrando cómo le quedaría puesta.

El objetivo no es lanzar un producto completo, sino aislar y validar el "momento mágico" central (ver el resultado en minutos, con el mínimo esfuerzo posible) antes de construir cualquier funcionalidad adicional. Todo lo que no sea estrictamente necesario para que ese momento ocurra y sea confiable —galería, etiquetas, freemium, compartir— queda fuera de esta versión y pasa a v1.

**Nota de secuencia:** este PRD asume que la validación de problema (encuesta, 18 respuestas: 67% vivió la situación de decidir "fuera de casa"; 89% valora resolver la duda con anticipación) ya se hizo. La validación de comportamiento con el concierge test manual sigue siendo el paso recomendado antes de invertir en desarrollo — este documento sirve para tenerlo listo en el momento en que esa validación dé luz verde, o para correr el prototipo como parte de una validación de mayor escala si se decide saltar directo a construir.

---

## 2. Problema

Las personas que tienen que decidir qué ponerse para un evento o salida —especialmente cuando no pueden probarse la ropa físicamente (de viaje, en el trabajo, con poco tiempo)— resuelven hoy este problema de forma ineficiente y ansiógena: se prueban múltiples combinaciones en casa, ensucian ropa que no terminan usando, dependen de la opinión de terceros, y se olvidan de prendas que ya tienen.

Evidencia de investigación propia:
- 67% (12/18) de encuestados vivió la situación de decidir qué ponerse fuera de casa sin poder probarse la ropa.
- 89% (16/18) considera "algo valioso" o "muy valioso" resolver esta duda con anticipación y menos margen de error.
- Mayoría reporta probarse varias combinaciones en casa y/o pedir opinión a alguien como método actual.
- Frase representativa: *"me pruebo todo y saco fotos para acordarme lo que combina con qué, todo termina en desorden"*.

Evidencia de mercado:
- Apps de organización de placard existentes (Acloset, Whering, Stylebook, OpenWardrobe) tienen ~65% de abandono en onboarding por exigir carga manual de 100-250 prendas antes de dar valor. Es precisamente el error que este MVP está diseñado para no repetir.
- Indyx, con menor fricción y enfoque en certeza visual (no organización), tiene el rating más alto del segmento (4.8) y cobra USD 12,99/mes.

---

## 3. Usuario objetivo

**Persona primaria: Camila, 29 años**, Buenos Aires, trabajo híbrido, placard de ~80 prendas "lleno pero desordenado". Vive el problema 3-4 veces por semana. No es early adopter de tecnología pero adopta apps que resuelven algo concreto y rápido. Sensible a privacidad de su imagen pero no lee políticas de privacidad — necesita señales de confianza explícitas en el momento de uso.

**Job to be done (funcional):** "Cuando tengo que decidir qué ponerme para un evento futuro, quiero ver cómo me quedarían las prendas que ya tengo sin probármelas físicamente, para ahorrar tiempo y no desordenar el placard."

**Segmentos secundarios identificados** (para tener en cuenta en priorización, no en alcance del MVP):
- 18-24: más cómodos con IA, más propensos a compartir resultados socialmente, placard más chico.
- +45: menor confianza inicial en IA, más foco en utilidad práctica que en aspectos sociales.

El MVP se diseña para el segmento primario (Camila / 25-34); los otros segmentos son observación, no requisito.

---

## 4. Objetivo del MVP

Este MVP tiene un objetivo único y acotado: **validar si el resultado del VTON, entregado con el mínimo esfuerzo posible, es lo suficientemente convincente como para que el usuario complete el flujo y quiera repetirlo.**

No busca validar retención de largo plazo, monetización, ni organización de placard — esas hipótesis quedan para versiones posteriores, una vez que el loop base esté probado. Este es un test de **la primera impresión del producto**, no del producto completo.

**Métrica de éxito primaria:** % de usuarios que completan el flujo entero (sube foto propia → sube foto de prenda → ve el resultado) sin abandonar en el camino.
**Métrica de éxito secundaria:** % de usuarios que, tras ver su primer resultado, generan un segundo VTON en la misma sesión (repiten el flujo espontáneamente).
**Métrica de calidad:** % de resultados que el propio usuario califica como "se parece a mí" / representativo, medido con una pregunta simple post-resultado.

---

## 5. Alcance funcional del MVP

### 5.1 Incluido

Este MVP se limita a las funcionalidades estrictamente necesarias para que el loop central ocurra y sea confiable. No se incluye nada que no sea condición necesaria para ese objetivo.

| # | Funcionalidad | Descripción funcional |
|---|---|---|
| F1 | Generación de VTON foto-a-foto | El usuario sube 1 foto propia + 1 foto de una prenda que ya posee. El sistema devuelve una imagen generada mostrando la prenda puesta sobre la persona. Es el corazón funcional de este MVP. |
| F2 | Flujo sin fricción de entrada | El usuario puede generar su VTON sin necesidad de crear cuenta, ni ingresar datos personales, ni pasar por ningún paso previo. Entra a la aplicación y llega directo a la posibilidad de subir sus dos fotos. |
| F3 | Transparencia de datos en el momento de subida | Antes de subir la foto propia, se le informa al usuario en una frase breve qué se hace con su imagen (uso, tiempo de retención, y que no se usa para entrenar modelos de IA). Es condición de confianza para que suba la foto en primer lugar. |
| F4 | Eliminación de foto propia | El usuario puede eliminar su foto original en cualquier momento después de generar un resultado. Complementa la transparencia de F3: no alcanza con decir qué se hace con la foto si el usuario no tiene control real sobre ella. |
| F5 | Validación de calidad de foto antes de generar | Si la foto subida (propia o de la prenda) tiene problemas evidentes de calidad (muy oscura, recortada, borrosa), el sistema lo informa antes de generar un resultado de baja calidad, y ofrece volver a intentar. Protege la primera impresión del producto, que es justamente lo que este MVP mide. |
| F6 | Repetir el flujo con otra prenda | Una vez visto el resultado, el usuario puede volver a generar un VTON con una prenda distinta, sin tener que volver a subir su foto propia. No implica guardar historial ni galería — es simplemente no perder la foto propia ya cargada dentro de la misma sesión. |

### 5.2 Explícitamente fuera de alcance de este MVP (pasan a v1)

Estas funcionalidades formaban parte de una versión anterior de este documento pensada como un producto más completo. Se postergan a propósito porque no son necesarias para validar el loop central, y agregarlas ahora diluiría la medición de esta primera validación.

| Funcionalidad | Motivo de exclusión en esta versión |
|---|---|
| Galería de resultados generados | Requiere persistencia de cuenta/usuario entre sesiones, lo cual reintroduce fricción de registro que este MVP evita a propósito. |
| Favoritos en galería | Depende de que exista galería (ver arriba). |
| Etiquetado por ocasión | Es una funcionalidad de organización, no de validación del momento central. |
| Filtro de galería por etiqueta | Depende de galería y etiquetado. |
| Compartir resultado | No es necesario para medir si el resultado convence al propio usuario; se puede sumar una vez validado el core. |
| Modelo freemium / límite de uso gratuito | La monetización se pospone: en esta fase el objetivo es medir si el producto genera valor, no si genera ingresos. Introducir límites de uso ahora contaminaría la medición de si el usuario repite el flujo por interés genuino. |
| Upgrade a plan pago | Depende del punto anterior. |
| Carga o prueba de prendas que el usuario no posee (compra/shopping) | Fuera del problema validado; es una hipótesis distinta no probada aún. |
| Combinación de múltiples prendas en un mismo VTON (outfit completo) | Aumenta la complejidad técnica y de validación; se prueba primero con una prenda por vez. |
| Categorización automática de placard | No es necesaria para el loop de valor central. |
| Recomendaciones de outfit generadas por IA | Requiere dataset amplio y confianza del usuario que todavía no existe en esta etapa. |
| Sincronización pasiva de compras | Infraestructura compleja; valiosa pero prematura. |
| Cost-per-wear / tracking de uso de prendas físicas | No resuelve el dolor principal identificado. |
| Recomendación por clima | Mecanismo de retención de v2, no de validación del MVP. |
| Múltiples fotos propias (360°, video) | Aumenta la fricción de carga; el MVP debe funcionar con una foto frontal. |

---

## 6. Flujo funcional principal

1. El usuario ingresa a la aplicación (sin registro, sin login, sin datos personales previos).
2. Se le presenta la transparencia de datos (F3) antes de pedirle la foto propia.
3. El usuario sube una foto propia (cuerpo entero o torso, según la prenda).
4. Si la foto tiene problemas evidentes de calidad, el sistema lo informa y ofrece volver a intentar (F5).
5. El usuario sube una foto de una prenda que ya posee.
6. Si la foto de la prenda tiene problemas evidentes de calidad, el sistema lo informa y ofrece volver a intentar (F5).
7. El sistema procesa y genera el resultado del VTON.
8. Se le muestra el resultado al usuario.
9. Se le hace una pregunta breve de calidad percibida (ej. "¿Este resultado se parece a vos?").
10. El usuario puede generar otro VTON con una prenda distinta sin volver a subir su foto propia (F6), o eliminar su foto propia y salir (F4).

Este flujo es intencionalmente lineal y corto: no hay ramificaciones, no hay pantallas de configuración, no hay pasos opcionales más allá de repetir el core o eliminar la foto. El objetivo es medir el loop en su forma más pura posible.

---

## 7. Monetización — nota de alcance

Este MVP **no incluye monetización**. El modelo freemium (límite de uso gratuito, plan pago, puntos de conversión) queda documentado como una definición de v1, condicionada a que el loop central de este MVP demuestre que genera valor real para el usuario. Introducir un límite de uso o una pantalla de pago en esta etapa mezclaría dos preguntas distintas — "¿le sirve esto?" y "¿pagaría por esto?" — cuando todavía no se respondió la primera.

*(La definición completa del modelo freemium que se había explorado —plan gratuito, plan pago, puntos de conversión sugeridos— queda preservada en la versión anterior de este documento para retomarla en v1.)*

---

## 8. Requisitos funcionales de confianza y privacidad

Estos requisitos son de prioridad alta porque condicionan si el usuario sube su foto en primer lugar — sin esto, ninguna otra funcionalidad se puede validar:

- El sistema debe comunicar, en el momento de la carga de la foto (no en una política separada), qué se hace con la imagen, cuánto tiempo se conserva, y que no se usa para entrenar modelos de IA.
- El usuario debe poder eliminar su foto original en cualquier momento después de generar resultados.
- El sistema no debe solicitar datos personales adicionales (nombre, email) en ningún punto de este flujo.
- Si la calidad de la foto subida es insuficiente para un buen resultado (mala luz, encuadre incorrecto), el sistema debe informarlo antes de generar un resultado de baja calidad, y ofrecer volver a intentar.

---

## 9. Métricas a instrumentar desde el diseño

Dado que este MVP es, en sí mismo, un instrumento de validación, se debe registrar desde el inicio:

- Tasa de finalización del flujo completo (entrada → foto propia → foto de prenda → resultado visto).
- Punto exacto de abandono, si lo hay (antes de subir foto propia, antes de subir prenda, o después de ver el resultado).
- % de usuarios que generan un segundo VTON en la misma sesión.
- Calidad percibida del resultado (respuesta a la pregunta post-resultado).
- Tiempo total del flujo, de entrada a resultado visto.
- Cantidad de reintentos por problemas de calidad de foto (F5), como proxy de fricción técnica.

---

## 10. Riesgos conocidos y mitigaciones funcionales

| Riesgo | Impacto | Mitigación funcional |
|---|---|---|
| Degradación de calidad del VTON con fotos caseras ("in-the-wild") | Alto — puede romper la confianza en el primer uso, que es lo único que este MVP mide | Validación de calidad de foto antes de generar (F5); mensaje que setea expectativa de resultado aproximado. |
| Fricción o rechazo a subir foto de cuerpo entero | Alto — sin foto no hay producto | Transparencia de datos explícita (F3); eliminación de foto disponible siempre (F4). |
| Usuario prueba una vez y no repite ni en la misma sesión | Alto — sería la señal más temprana de que el core no engancha | Es justamente lo que este MVP está diseñado para medir; no es un riesgo a "resolver" sino el resultado a observar. |
| Sin cuenta ni galería, se pierde el resultado al cerrar la app | Medio — puede generar frustración si el usuario quería conservar la imagen | Aceptado como limitación intencional de esta versión; si se vuelve un problema recurrente, es señal a favor de priorizar galería en v1. |

---

## 11. Fuera de este documento

Este PRD no define:
- Interfaz de usuario ni diseño visual.
- Proveedor técnico de VTON ni arquitectura de implementación.
- Modelo de monetización definitivo (ver sección 7).
- Plan de adquisición de usuarios o canales de marketing.

Estos puntos requieren definiciones separadas, idealmente informadas por los resultados que arroje este mismo MVP en su primera fase de uso.