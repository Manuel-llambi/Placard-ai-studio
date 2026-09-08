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

/**
 * Genera el resultado de probador virtual (VTON) llamando al backend real.
 *
 * Este proyecto es hoy un prototipo mayormente mockeado (ver CLAUDE.md): todavía
 * no hay un backend real en `/api/virtual-try-on` ni una integración con
 * `@google/genai`. Cuando el endpoint exista, probablemente haya que mandar las
 * fotos como multipart en vez de las URLs/URIs locales, algo así:
 *
 *   const formData = new FormData();
 *   formData.append('garmentImage', garmentPhoto.imageUrl);
 *   formData.append('referenceImage', referencePhoto.imageUrl);
 *
 *   const { data } = await apiClient.post<VtonResult>(
 *     '/api/virtual-try-on',
 *     formData,
 *     { headers: { 'Content-Type': 'multipart/form-data' } }
 *   );
 *
 *   return data;
 */
export async function generateVirtualTryOn(
  params: GenerateVirtualTryOnParams
): Promise<VtonResult> {
  try {
    const { data } = await apiClient.post<VtonResult>('/api/virtual-try-on', params);
    return data;
  } catch (error) {
    throw new Error(
      'generateVirtualTryOn no está implementada todavía: falta conectar con el endpoint real del backend (ver TODO en virtualTryOnService.ts).'
    );
  }
}
