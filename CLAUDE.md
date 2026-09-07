# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proyecto

Placard — un flujo de onboarding/demo mobile-first para un producto de probador virtual de moda (VTON). Generado y editado con **Google AI Studio** (ver `metadata.json`: `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`, `requestFramePermissions: ["camera"]`). Todos los textos y copys de la UI están en español (Argentina).

**Estado actual**: este es un prototipo completamente mockeado. No hay backend ni ninguna llamada real a Gemini/`@google/genai` en `src/` — cada "generación" (`ProcessingModal`, `Step3Result`) resuelve desde datos estáticos en `src/data/samples.ts` (URLs de imágenes de Unsplash) mediante un timer. `@google/genai` y `express` están en `package.json` como dependencias para una futura integración real, no porque ya estén conectadas.

## Comandos

- `npm run dev` — servidor de desarrollo de Vite en el puerto 3000, bindeado a `0.0.0.0`.
- `npm run build` — build de producción (`dist/`).
- `npm run preview` — preview del build de producción.
- `npm run lint` — solo type-check (`tsc --noEmit`); no hay un linter separado (ESLint) configurado.
- `npm run clean` — elimina `dist/` y `server.js`.
- No hay test runner configurado en este repo.

## Arquitectura

- **Máquina de estados de página única, sin router.** `src/App.tsx` mantiene todo el estado de alto nivel (`OnboardingStep`, prenda seleccionada, foto de referencia, resultado activo, estado de auth) en `useState` y renderiza un componente de paso a la vez según `currentStep` (`src/types.ts`: `OnboardingStep`). Agregar una pantalla nueva implica sumar un literal de paso + un bloque condicional nuevo en `App.tsx`, no una ruta.
- **React Native Web, no DOM plano.** Los componentes usan `View` / `Text` / `TouchableOpacity` de `react-native` + `StyleSheet.create` (aliaseado a `react-native-web` en `vite.config.ts`), no tags HTML ni clases de Tailwind — aunque Tailwind (`@tailwindcss/vite`) también está instalado y se usa en `index.html`/`index.css`. Respetá el patrón que ya usa el archivo que estés editando; no mezcles ambos enfoques de estilos dentro de un mismo componente.
- **Todo entra en un frame de teléfono fijo.** El estilo `phoneContainer` de `App.tsx` limita el ancho a 448px y lo centra — la app está pensada para verse como un mockup de teléfono en desktop, no como una web full-width responsive.
- **Flujo**: `welcome` → `step1_garment` (elegir/subir una `Garment`) → `step2_reference` (elegir una `ReferencePhoto`) → `processing` (`ProcessingModal`, progreso falso + texto de estado por etapas, sin trabajo real) → `step3_result` (`Step3Result`, muestra un `VtonResult`) → opcionalmente `guest_wardrobe` (preview post-registro), con `SignUpModal` condicionando las features ligadas a cuenta. `handleReset`/`handleBack` en `App.tsx` son la única lógica de navegación.
- **Modelos de datos** (`src/types.ts`): `Garment`, `ReferencePhoto`, `VtonResult` son los tres tipos de dominio centrales que atraviesan las props de casi todos los componentes. `src/data/samples.ts` es la única fuente de contenido mockeado (`SAMPLE_GARMENTS`, `DEMO_REFERENCE_PHOTO`, `SAMPLE_VTON_RESULTS`, `GUIDE_PHOTOS`) — al conectar la generación real más adelante, este es el módulo cuya forma tiene que igualar cualquier respuesta real de la API.
- **`ErrorBoundary`** (`src/main.tsx`) envuelve toda la app y deliberadamente ignora errores de inyección de extensiones tipo MetaMask/wallet (también filtrados a nivel `window.onerror`/`onunhandledrejection` en `index.html`) — es supresión de ruido intencional para el entorno iframe de AI Studio, no código muerto para borrar.
- **El HMR de Vite se deshabilita condicionalmente** vía la variable de entorno `DISABLE_HMR` (`vite.config.ts`) — es una adaptación para que el agente de AI Studio edite archivos sin parpadeo; no "arregles" esto sacando el chequeo.
