# Historias de usuario: VTON foto-a-foto (MVP)

Fuente: `docs/PRD.md` — PRD "Placard Digital con VTON (MVP)", v2.0.

## H1: Entrar a la app sin fricción de registro
- **Descripción**: Como usuaria que necesita decidir qué ponerse, quiero entrar a la app y llegar directo a la posibilidad de subir mis fotos, sin crear cuenta ni ingresar datos personales, para no tener que superar ninguna barrera antes de obtener valor.
- **Criterios de aceptación funcionales**:
  - Al ingresar a la app no se solicita login, registro, ni ningún dato personal (nombre, email, teléfono).
  - Desde la pantalla de entrada, la usuaria puede avanzar directo hacia la carga de su foto propia.
  - No existe ningún paso previo obligatorio (encuestas, permisos genéricos, onboarding de producto) antes de llegar a la carga de fotos.
- **Criterios de experiencia**:
  - La pantalla de bienvenida comunica en una frase simple qué hace la app y qué se le va a pedir a continuación (dos fotos), sin tono de "app de productividad" ni de urgencia.
  - El llamado a la acción para empezar es único y evidente — no hay opciones secundarias que compitan por la atención en esta pantalla.
- **Casos borde**:
  - Usuaria que reabre la app tras cerrarla en este punto: debe volver a ver la misma pantalla de entrada (no hay estado de cuenta que recordar).
  - Conexión de red inexistente o muy lenta al abrir la app: la app debe comunicarlo antes de que la usuaria intente cargar una foto y falle sin explicación.
- **Dependencias**: ninguna.
- **Prioridad**: alta — es la puerta de entrada al producto; el PRD (F2) la marca como condición para que el resto del flujo exista.

---

## H2: Ver la transparencia de datos antes de subir la foto propia
- **Descripción**: Como usuaria sensible a la privacidad de mi imagen, quiero que se me explique qué se hace con mi foto antes de subirla, para decidir con confianza si quiero continuar.
- **Criterios de aceptación funcionales**:
  - Antes de que se habilite la carga de la foto propia, se muestra una frase breve que informa: para qué se usa la imagen, cuánto tiempo se conserva, y que no se usa para entrenar modelos de IA.
  - Este mensaje aparece en el momento de la carga (no como enlace a una política de privacidad separada).
  - La usuaria no puede llegar al selector de foto sin haber visto este mensaje al menos una vez en la sesión.
- **Criterios de experiencia**:
  - El tono del mensaje es tranquilizador y concreto, no legal ni alarmista — coherente con una marca que transmite confianza cotidiana, no letra chica.
  - El mensaje es breve: se lee en segundos, no interrumpe el impulso de continuar.
- **Casos borde**:
  - Usuaria que no lee el mensaje y avanza rápido: el mensaje debe seguir siendo accesible/revisable si quiere volver a verlo antes de confirmar la subida.
- **Dependencias**: depende de H1.
- **Prioridad**: alta — el PRD (sección 8) la marca explícitamente como requisito de prioridad alta: sin confianza, la usuaria no sube la foto y ninguna otra funcionalidad se puede validar.

---

## H3: Subir la foto propia con validación de calidad
- **Descripción**: Como usuaria, quiero subir una foto mía (cuerpo entero o torso) y ser avisada si tiene un problema evidente de calidad, para no llegar a un resultado de VTON pobre por una foto que puedo corregir antes.
- **Criterios de aceptación funcionales**:
  - La usuaria puede subir una foto propia desde su dispositivo (cámara o galería).
  - Antes de continuar al siguiente paso, el sistema evalúa si la foto tiene problemas evidentes de calidad (muy oscura, recortada, borrosa).
  - Si detecta un problema, informa el motivo de forma específica y ofrece volver a intentar sin perder el contexto (no hay que reiniciar el flujo desde H1).
  - Si la foto pasa la validación, la usuaria avanza al paso de subir la foto de la prenda.
  - El CTA "Continuar" permanece deshabilitado hasta que la usuaria cargue una foto (desde cámara o galería); se habilita recién cuando la foto queda cargada.
- **Criterios de experiencia**:
  - El aviso de calidad insuficiente se siente como una sugerencia útil ("mejor probemos con otra"), no como un rechazo o error del sistema.
  - Mientras se evalúa la calidad hay un estado de carga breve y claro, sin sensación de que el sistema se colgó.
- **Casos borde**:
  - Permisos de cámara o galería denegados por el sistema operativo: la app debe explicar qué permiso falta y cómo habilitarlo, no fallar en silencio.
  - Usuaria sube una foto que no es una persona (objeto, paisaje, captura de pantalla): el PRD no define validación de contenido más allá de calidad técnica — ver "Preguntas para PO".
  - Foto de tamaño/formato no soportado por el sistema.
  - Usuaria cancela la selección de foto a mitad de camino.
- **Dependencias**: depende de H2.
- **Prioridad**: alta — es parte del corazón funcional del MVP (F1) y de un requisito explícito de prioridad alta (F5, sección 8).

---

## H4: Subir la foto de la prenda con validación de calidad
- **Descripción**: Como usuaria, quiero subir una foto de una prenda que ya tengo y ser avisada si tiene un problema evidente de calidad, para asegurarme de que el resultado del VTON va a ser representativo.
- **Criterios de aceptación funcionales**:
  - La usuaria puede subir una foto de una prenda propia desde su dispositivo (cámara o galería).
  - El sistema evalúa la foto de la prenda con el mismo criterio de calidad que la foto propia (muy oscura, recortada, borrosa) antes de generar el resultado.
  - Si detecta un problema, lo informa y ofrece volver a intentar sin perder la foto propia ya cargada.
  - Si la foto pasa la validación, el sistema pasa a generar el resultado del VTON.
  - El CTA "Continuar" permanece deshabilitado hasta que la usuaria cargue una foto de la prenda (desde cámara o galería); se habilita recién cuando la foto queda cargada.
- **Criterios de experiencia**:
  - Mismo tono tranquilo que en H3 para el aviso de calidad insuficiente.
  - Queda claro en pantalla que la foto propia ya cargada se mantiene — la usuaria no debe temer tener que repetir ese paso.
- **Casos borde**:
  - Permisos de cámara o galería denegados.
  - Usuaria sube una foto que no contiene una prenda reconocible (mismo caso que en H3, aplicado a la prenda) — ver "Preguntas para PO".
  - Usuaria intenta subir la misma foto que ya usó como foto propia.
- **Dependencias**: depende de H3.
- **Prioridad**: alta — completa el corazón funcional del MVP (F1) junto con el requisito de calidad (F5).

---

## H5: Generar y ver el resultado del VTON
- **Descripción**: Como usuaria, quiero ver una imagen generada de cómo me quedaría puesta la prenda que subí, para decidir si me sirve sin tener que probármela físicamente.
- **Criterios de aceptación funcionales**:
  - Una vez validadas ambas fotos (H3, H4), el sistema procesa y genera una imagen mostrando la prenda puesta sobre la persona de la foto propia.
  - El resultado se muestra a la usuaria en pantalla completa o destacado como elemento principal de la pantalla de resultado.
- **Criterios de experiencia**:
  - Mientras se genera el resultado, se muestra un estado de espera que transmite calma ("estamos preparando tu look"), no una barra de progreso técnica o ansiógena.
  - Si el tiempo de procesamiento se extiende, el estado de espera lo sostiene sin dar sensación de que algo se rompió (el PRD no define un tiempo esperado — ver "Preguntas para PO").
  - La presentación del resultado es el momento de mayor cuidado visual del flujo: es "el momento mágico" que el MVP existe para validar.
- **Casos borde**:
  - Falla técnica en la generación (no relacionada con calidad de foto, sino error de procesamiento): el PRD no especifica el comportamiento esperado — ver "Preguntas para PO".
  - Usuaria cierra o minimiza la app mientras se genera el resultado.
  - Conexión se pierde durante el procesamiento.
- **Dependencias**: depende de H4.
- **Prioridad**: alta — es F1, el corazón funcional completo del MVP y el objeto central de validación del producto.

---

## H6: Calificar si el resultado se parece a la usuaria
- **Descripción**: Como usuaria que acaba de ver su resultado, quiero poder decir si se parece a mí o no, para que el equipo de producto sepa si la calidad del VTON es confiable.
- **Criterios de aceptación funcionales**:
  - Inmediatamente después de mostrar el resultado, se presenta una pregunta breve de calidad percibida (ej. "¿Este resultado se parece a vos?").
  - La respuesta de la usuaria queda registrada asociada a ese resultado, para instrumentación de la métrica de calidad del MVP.
  - Responder la pregunta no es un paso bloqueante: la usuaria puede continuar el flujo (H7 o H8) sin responder si no quiere.
- **Criterios de experiencia**:
  - La pregunta se siente como un gesto simple (ej. dos opciones tipo sí/no o una escala corta), no como una encuesta.
  - No interrumpe la posibilidad de seguir mirando el resultado.
- **Casos borde**:
  - Usuaria ignora la pregunta y sale de la pantalla directamente.
  - Usuaria responde y luego quiere generar otro VTON (H7): ambas acciones deben poder convivir sin fricción.
- **Dependencias**: depende de H5.
- **Prioridad**: media — no es parte del loop funcional core (F1-F6) sino instrumentación explícita de la métrica de calidad definida en la sección 9 del PRD; su ausencia no rompe el flujo pero deja sin medir el objetivo del MVP.

---

## H7: Repetir el flujo con otra prenda sin volver a subir la foto propia
- **Descripción**: Como usuaria que ya vio un resultado, quiero probarme otra prenda sin tener que volver a subir mi foto, para poder comparar opciones rápido.
- **Criterios de aceptación funcionales**:
  - Desde la pantalla de resultado, la usuaria puede iniciar un nuevo VTON subiendo solo una nueva foto de prenda.
  - La foto propia cargada previamente en la sesión se reutiliza automáticamente, sin pedirla de nuevo.
  - La nueva foto de prenda pasa por la misma validación de calidad que en H4.
  - No se guarda historial ni galería de los resultados generados: esto es explícitamente fuera de alcance del MVP.
- **Criterios de experiencia**:
  - La transición de "ver resultado" a "subir otra prenda" se siente liviana, invitando a repetir sin fricción — es la acción que el MVP quiere incentivar espontáneamente.
- **Casos borde**:
  - Usuaria cierra la app entre un resultado y el siguiente: el PRD no define si la foto propia se conserva al reabrir la app — ver "Preguntas para PO".
  - Usuaria elimina su foto propia (H8) y luego intenta repetir el flujo: no debería poder reutilizar una foto que ya no existe.
  - Repetición ilimitada dentro de la misma sesión: el PRD no define un tope técnico de repeticiones — ver "Preguntas para PO".
- **Dependencias**: depende de H5. Es mutuamente excluyente en el momento de uso con H8 (una vez eliminada la foto propia, H7 deja de estar disponible en esa sesión).
- **Prioridad**: media — es F6, mejora el loop pero el flujo mínimo del MVP se completa sin repetirlo; sin embargo es la funcionalidad detrás de la métrica de éxito secundaria del PRD.

---

## H8: Eliminar la foto propia
- **Descripción**: Como usuaria preocupada por mi privacidad, quiero poder eliminar mi foto original en cualquier momento después de ver un resultado, para tener control real sobre mi imagen.
- **Criterios de aceptación funcionales**:
  - Después de generar al menos un resultado, la usuaria tiene disponible una acción explícita para eliminar su foto propia original.
  - Al confirmar la eliminación, la foto propia deja de estar disponible para nuevos VTON en la sesión (bloquea H7 hasta que se suba una nueva).
  - La eliminación es efectiva de inmediato, no queda pendiente ni requiere confirmación adicional fuera de la acción misma.
- **Criterios de experiencia**:
  - La acción de eliminar es fácil de encontrar (no escondida en un menú de configuración, dado que no existe pantalla de perfil en este MVP).
  - El sistema confirma que la eliminación se realizó, con un mensaje breve y tranquilo, no alarmista.
- **Casos borde**:
  - Usuaria elimina la foto propia y luego intenta generar otro VTON (H7): debe pedirle una nueva foto propia como si fuera la primera vez.
  - Usuaria elimina la foto propia mientras está en medio de la generación de un resultado (H5): el PRD no define este cruce — ver "Preguntas para PO".
- **Dependencias**: depende de H3 (requiere que exista una foto propia cargada).
- **Prioridad**: alta — el PRD (sección 8) la marca explícitamente como requisito de prioridad alta, complemento indispensable de la transparencia de datos (H2/F3).

---

## Resumen
- Total de historias: 8
- Historias de prioridad alta: H1 (Entrar sin fricción), H2 (Transparencia de datos), H3 (Subir foto propia + calidad), H4 (Subir foto de prenda + calidad), H5 (Generar y ver resultado), H8 (Eliminar foto propia)
- Historias de prioridad media: H6 (Calificar resultado), H7 (Repetir con otra prenda)
- Historias de prioridad baja: ninguna

## Preguntas para PO
- **Falla técnica en la generación (H5)**: el PRD cubre la validación de calidad de foto (F5) pero no define qué debe pasar si el proceso de generación en sí falla (error de servicio, timeout). ¿Se reintenta automáticamente, se le pide a la usuaria reintentar manualmente, o se le ofrece volver a empezar?
- **Tiempo esperado de procesamiento (H5)**: no hay un rango de tiempo definido para el estado de espera. ¿Existe un umbral a partir del cual se considera que algo salió mal?
- **Validación de contenido de las fotos (H3, H4)**: F5 solo cubre calidad técnica (oscuridad, recorte, desenfoque). ¿Debe el sistema validar también que la foto propia contenga una persona y que la foto de la prenda contenga efectivamente una prenda, o eso queda fuera de alcance del MVP y se delega por completo al criterio de la usuaria?
- **Persistencia de la foto propia entre sesiones (H7)**: el PRD dice que no se pierde la foto propia "dentro de la misma sesión", pero no aclara qué pasa si la usuaria cierra la app y vuelve a entrar poco después — ¿se considera la misma sesión o se pierde la foto y hay que volver a subirla?
- **Tope de repeticiones (H7)**: al no haber límite de uso (freemium fuera de alcance), ¿hay algún tope técnico razonable de VTONs por sesión, o se asume ilimitado mientras dure la sesión?
- **Cruce entre eliminar foto y generación en curso (H8)**: si la usuaria elimina su foto propia justo mientras se está generando un resultado con esa foto, ¿el resultado en curso se cancela o se completa igual?
