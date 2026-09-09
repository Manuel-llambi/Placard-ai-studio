import * as ImagePicker from 'expo-image-picker';

// Wrapper alrededor de expo-image-picker para las dos pantallas de captura
// (Step1Garment: prenda, Step2Reference: cuerpo). Reemplaza el flujo web
// anterior (getUserMedia + <video> + canvas + <input type="file">), que no
// existe en una app nativa corrida desde Expo Go.

export interface PickedImage {
  uri: string;
  fileName: string;
}

function toPickedImage(result: ImagePicker.ImagePickerResult): PickedImage | null {
  if (result.canceled || !result.assets?.[0]) return null;
  const asset = result.assets[0];
  return {
    uri: asset.uri,
    fileName: asset.fileName ?? `foto-${Date.now()}.jpg`,
  };
}

/**
 * Abre la cámara nativa del dispositivo. Pide permiso de cámara si todavía
 * no fue otorgado. Devuelve `null` si el usuario canceló la captura.
 */
export async function pickImageFromCamera(): Promise<PickedImage | null> {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) {
    throw new Error('Necesitamos permiso de cámara para sacar la foto.');
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ['images'],
    quality: 0.85,
  });

  return toPickedImage(result);
}

/**
 * Abre la galería nativa del dispositivo. Pide permiso de acceso a fotos si
 * todavía no fue otorgado. Devuelve `null` si el usuario canceló la selección.
 */
export async function pickImageFromGallery(): Promise<PickedImage | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    throw new Error('Necesitamos permiso para acceder a tu galería.');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 0.85,
  });

  return toPickedImage(result);
}
