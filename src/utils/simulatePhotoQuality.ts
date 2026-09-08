export type PhotoQualityIssue = 'muy_oscura' | 'recortada' | 'borrosa';

export interface PhotoQualityResult {
  approved: boolean;
  issue?: PhotoQualityIssue;
}

const ISSUE_MESSAGES: Record<PhotoQualityIssue, string> = {
  muy_oscura: 'La foto se ve un poco oscura. Probá con más luz natural para que la IA distinga bien la prenda.',
  recortada: 'Parece que la imagen quedó recortada en el encuadre. Alejá un poco la cámara para que entre completo.',
  borrosa: 'La imagen salió un poco borrosa. Mantené el teléfono firme al sacar la foto.',
};

export function getPhotoQualityIssueMessage(issue: PhotoQualityIssue): string {
  return ISSUE_MESSAGES[issue];
}

const QUALITY_ISSUES: PhotoQualityIssue[] = ['muy_oscura', 'recortada', 'borrosa'];

/**
 * Simula una validación de calidad de foto (no analiza el archivo real).
 * Reusable para la prenda propia (H4) y a futuro para la foto de referencia (H3),
 * que comparte el mismo criterio de calidad.
 *
 * `forceIssue` es un atajo solo para poder probar el estado de rechazo de forma
 * confiable en la demo (no depende del azar).
 */
export function simulatePhotoQualityCheck(forceIssue?: PhotoQualityIssue): Promise<PhotoQualityResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (forceIssue) {
        resolve({ approved: false, issue: forceIssue });
        return;
      }

      const roll = Math.random();
      if (roll >= 0.8) {
        const issue = QUALITY_ISSUES[Math.floor(Math.random() * QUALITY_ISSUES.length)];
        resolve({ approved: false, issue });
        return;
      }

      resolve({ approved: true });
    }, 700);
  });
}
