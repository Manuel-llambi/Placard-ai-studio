import axios from 'axios';
import { Garment, ReferencePhoto, VtonResult } from '../types';

/**
 * Parámetros necesarios para pedirle al backend que genere el probador
 * virtual (VTON): la prenda elegida/subida en el Paso 1 y la foto de
 * referencia (cuerpo) tomada/subida en el Paso 2.
 */
export interface GenerateVirtualTryOnParams {
  garmentPhoto: Garment;
  referencePhoto: ReferencePhoto;
}

// Expo solo inyecta al bundle las env vars con el prefijo EXPO_PUBLIC_ (ver .env / .env.example).
// Si estás probando desde el celular con el QR de Expo Go, "localhost" no sirve: necesitás la IP
// de tu compu en la red local (o un túnel con "npx expo start --tunnel").
const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

// Adivina extensión/mime a partir de la uri de la imagen (uri local del picker
// tipo file://..., o una uri remota https:// de las fotos demo/muestra).
function guessImagePart(uri: string, fallbackName: string) {
  const extMatch = /\.(\w+)(?:\?.*)?$/.exec(uri);
  const ext = (extMatch?.[1] || 'jpg').toLowerCase();
  const type = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
  return { uri, name: `${fallbackName}.${ext}`, type };
}

/**
 * Genera el resultado de probador virtual (VTON) llamando al backend real.
 *
 * El back espera un multipart con un único campo repetido "files" (array),
 * con la foto del modelo/referencia primero y la de la prenda segundo.
 */
export async function generateVirtualTryOn(
  params: GenerateVirtualTryOnParams
): Promise<VtonResult> {
  const formData = new FormData();
  // Orden importa: el back interpreta la primera imagen como el modelo/referencia
  // y la segunda como la prenda.
  formData.append(
    'file',
    guessImagePart(params.referencePhoto.imageUrl, 'reference') as unknown as Blob
  );
  formData.append(
    'file',
    guessImagePart(params.garmentPhoto.imageUrl, 'garment') as unknown as Blob
  );

  // No seteamos el header Content-Type a mano: en React Native, cuando el body
  // es un FormData, el runtime nativo arma el boundary del multipart solo. Si lo
  // fijamos nosotros sin boundary, el back puede no poder parsear las partes.
  try {
    const { data }: any = await apiClient.post('/vton/', formData);

    if (!data.ok) {
      throw new Error(data.error?.body?.message || 'No pudimos generar tu look. Probá de nuevo en unos segundos.');
    }

    // El back solo devuelve { ok, image } (image es la URL de la imagen ya
    // generada). El resto de los campos de VtonResult (título, descripción,
    // etc.) todavía no vienen del back, así que los completamos acá con lo
    // que sí sabemos (prenda y foto de referencia elegidas) y placeholders
    // razonables — mismo criterio que usaba App.tsx para el resultado mockeado
    // de una prenda propia.
    const resultImageUrl = data.image;
    if (!resultImageUrl) {
      throw new Error('El back no devolvió la imagen generada. Probá de nuevo en unos segundos.');
    }

    const result: VtonResult = {
      id: `vton-${Date.now()}`,
      garment: params.garmentPhoto,
      referencePhoto: params.referencePhoto,
      resultImageUrl,
      lookTitle: `Look Diario · ${params.garmentPhoto.name}`,
      lookNumber: '#01',
      stylingDescription: 'Calce personalizado adaptado a tu silueta con caída natural',
      fitPercentage: 97,
      size: 'Talle S',
      date: 'Hoy',
      isFavorite: false,
      occasion: 'Casual',
    };
    return result;
  } catch (err) {
    // El back informa el motivo del fallo en el campo "error" del body de la
    // respuesta (4xx/5xx). Normalizamos todo a un Error con un mensaje apto
    // para mostrarle a la usuaria (ver handleGeneratePress en Step2Reference.tsx,
    // que lo muestra en un snackbar y corta el flujo).
    if (axios.isAxiosError(err)) {
      const backendMessage = (err.response?.data as { error?: string } | undefined)?.error;
      throw new Error(
        backendMessage || 'No pudimos generar tu look. Probá de nuevo en unos segundos.'
      );
    }
    throw err;
  }
}
