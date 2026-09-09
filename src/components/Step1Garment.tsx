import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {
  Camera,
  Image as ImageIcon,
  Check,
  Sparkles,
  X,
  RotateCcw,
  Trash2,
} from 'lucide-react-native';
import { Garment } from '../types';
import { GarmentPhotoGuideModal } from './GarmentPhotoGuideModal';
import { pickImageFromCamera, pickImageFromGallery } from '../utils/pickImage';
import {
  PhotoQualityIssue,
  getPhotoQualityIssueMessage,
  simulatePhotoQualityCheck,
} from '../utils/simulatePhotoQuality';

type QualityStatus = 'idle' | 'checking' | 'approved' | 'rejected';

interface Step1GarmentProps {
  selectedGarment: Garment | null;
  onSelectGarment: (garment: Garment) => void;
  onContinue: () => void;
  onCustomUpload: (garment: Garment) => void;
}

export const Step1Garment: React.FC<Step1GarmentProps> = ({
  selectedGarment,
  onContinue,
  onCustomUpload,
}) => {
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // Foto propia capturada/subida en ESTA pantalla, se haya aprobado o no.
  // Se mantiene visible durante un rechazo/reintento para no perder el contexto.
  const [capturedGarment, setCapturedGarment] = useState<Garment | null>(
    () => (selectedGarment?.isCustomUpload ? selectedGarment : null)
  );
  // Qué dice el chequeo de calidad simulado sobre esa foto ahora mismo.
  const [qualityCheck, setQualityCheck] = useState<{ status: QualityStatus; issue?: PhotoQualityIssue }>(
    () => (selectedGarment?.isCustomUpload ? { status: 'approved' } : { status: 'idle' })
  );

  // Corre la validación de calidad simulada sobre una foto recién capturada/subida.
  // Solo si aprueba se eleva la foto al estado del padre (App.tsx) vía onCustomUpload;
  // si la rechaza, la prenda capturada se mantiene visible localmente para poder reintentar
  // sin perderla, pero el padre sigue con lo que tenía antes.
  const runQualityCheck = async (garment: Garment, forceIssue?: PhotoQualityIssue) => {
    setCapturedGarment(garment);
    setQualityCheck({ status: 'checking' });

    const result = await simulatePhotoQualityCheck(forceIssue);

    if (result.approved) {
      setQualityCheck({ status: 'approved' });
      onCustomUpload(garment);
    } else {
      setQualityCheck({ status: 'rejected', issue: result.issue });
    }
  };

  const buildCustomGarment = (imageUrl: string, name: string): Garment => ({
    id: `custom-garment-${Date.now()}`,
    name,
    category: 'Prenda propia',
    imageUrl,
    colorName: 'Tonalidad natural',
    colorHex: '#7A4655',
    material: 'Tejido real',
    description: 'Foto tomada por el usuario con recorte automático por IA.',
    isCustomUpload: true,
  });

  // Abre la cámara nativa del dispositivo (expo-image-picker) para fotografiar la prenda.
  const handleTakePhoto = async () => {
    setCameraError(null);
    try {
      const picked = await pickImageFromCamera();
      if (!picked) return; // el usuario canceló

      const customGarment = buildCustomGarment(picked.uri, 'Foto de prenda propia');
      // Atajo de prueba: si el nombre del archivo incluye "error", forzamos el
      // rechazo para poder ver el estado de calidad insuficiente sin depender del azar.
      const forceIssue: PhotoQualityIssue | undefined = /error/i.test(picked.fileName)
        ? 'muy_oscura'
        : undefined;
      runQualityCheck(customGarment, forceIssue);
    } catch (err) {
      console.warn('No se pudo abrir la cámara', err);
      setCameraError(
        err instanceof Error ? err.message : 'No pudimos acceder a la cámara. Revisá los permisos.'
      );
    }
  };

  // Abre la galería nativa del dispositivo (expo-image-picker) para elegir la foto de la prenda.
  const handleUploadGallery = async () => {
    setCameraError(null);
    try {
      const picked = await pickImageFromGallery();
      if (!picked) return; // el usuario canceló

      const name = picked.fileName.replace(/\.[^/.]+$/, '').slice(0, 24) || 'Mi prenda fotografiada';
      const customGarment = buildCustomGarment(picked.uri, name);
      const forceIssue: PhotoQualityIssue | undefined = /error/i.test(picked.fileName)
        ? 'muy_oscura'
        : undefined;
      runQualityCheck(customGarment, forceIssue);
    } catch (err) {
      console.warn('No se pudo abrir la galería', err);
      setCameraError(
        err instanceof Error ? err.message : 'No pudimos acceder a tu galería. Revisá los permisos.'
      );
    }
  };

  // Descarta la foto propia capturada en esta pantalla y vuelve a mostrar los botones
  // de captura. Solo limpia el estado local: si la foto ya había sido aprobada y elevada
  // al padre (App.tsx), la prenda seleccionada ahí no cambia hasta que se suba/capture otra.
  const handleDeleteCapturedGarment = () => {
    setCapturedGarment(null);
    setQualityCheck({ status: 'idle' });
  };

  // Si no se tocó "tomar foto"/"subir de galería" en esta pantalla, no bloqueamos nada
  // (deja intacto el click-through de demo con la prenda de catálogo precargada).
  // Apenas hay una foto propia en juego, hay que esperar a que quede aprobada.
  const canContinue = !capturedGarment || qualityCheck.status === 'approved';

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Step Indicator & Progress */}
      <View style={styles.indicatorContainer}>
        <View style={styles.indicatorBadge}>
          <View style={styles.dot} />
          <Text style={styles.indicatorText}>Paso 1 de 2</Text>
        </View>
        <View style={styles.progressBarTrack}>
          <View style={styles.progressBarFill} />
        </View>
      </View>

      {/* Headline & Description */}
      <View style={styles.headerBlock}>
        <Text style={styles.headline}>
          Primero, una prenda que ames
        </Text>
        <Text style={styles.description}>
          Sacale una foto a una prenda tuya para ver cómo te queda puesta en tu silueta.
        </Text>
      </View>

      {/* Capture Card */}
      <View id="garment-capture-card" style={styles.captureCard}>
        <View style={styles.cameraIconCircle}>
          <Camera size={24} color="#7A4655" strokeWidth={1.8} />
        </View>

        <Text style={styles.cardTitle}>
          Capturá tu prenda propia
        </Text>
        <Text style={styles.cardSubtitle}>
          Nuestra IA recortará el fondo automáticamente conservando texturas y caída.
        </Text>

        {/* Main Action Buttons */}
        <View style={styles.actionButtonsStack}>
          <TouchableOpacity
            id="btn-take-photo-garment"
            onPress={handleTakePhoto}
            activeOpacity={0.85}
            style={styles.primaryActionButton}
          >
            <Camera size={16} color="#FFFFFF" />
            <Text style={styles.primaryActionText}>Tomar foto a una prenda</Text>
          </TouchableOpacity>

          <TouchableOpacity
            id="btn-upload-gallery-garment"
            onPress={handleUploadGallery}
            activeOpacity={0.85}
            style={styles.secondaryActionButton}
          >
            <ImageIcon size={16} color="#75695E" />
            <Text style={styles.secondaryActionText}>Subir de mi galería</Text>
          </TouchableOpacity>
        </View>

        {/* Uploaded / Selected Custom Garment Feedback */}
        {capturedGarment && (
          <View style={styles.uploadedFeedbackBox}>
            <View style={styles.uploadedRow}>
              <Image
                source={{ uri: capturedGarment.imageUrl }}
                accessibilityLabel="Prenda personalizada"
                style={styles.uploadedThumb}
                resizeMode="cover"
              />
              <View style={styles.uploadedMeta}>
                {qualityCheck.status === 'checking' && (
                  <Text style={styles.checkingText}>Analizando calidad de la foto…</Text>
                )}

                {qualityCheck.status === 'approved' && (
                  <>
                    <View style={styles.detectedRow}>
                      <View style={styles.greenDot} />
                      <Text style={styles.detectedText}>Prenda propia capturada ✓</Text>
                    </View>
                    <Text style={styles.uploadedName} numberOfLines={1}>
                      {capturedGarment.name}
                    </Text>
                    <Text style={styles.uploadedDesc}>
                      Recorte por IA listo para calce
                    </Text>
                  </>
                )}

                {qualityCheck.status === 'rejected' && (
                  <View style={styles.detectedRow}>
                    <Text style={styles.issueText}>Imagen no compatible</Text>
                  </View>
                )}
              </View>

              <View style={styles.uploadedActions}>
                <TouchableOpacity
                  onPress={handleTakePhoto}
                  activeOpacity={0.7}
                  accessibilityLabel="Reintentar foto de la prenda"
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={styles.iconActionButton}
                >
                  <RotateCcw size={16} color="#75695E" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleDeleteCapturedGarment}
                  activeOpacity={0.7}
                  accessibilityLabel="Eliminar foto de la prenda"
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={styles.iconActionButton}
                >
                  <Trash2 size={16} color="#A85A46" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Motivo específico del rechazo, tono de sugerencia */}
            {qualityCheck.status === 'rejected' && qualityCheck.issue && (
              <View style={styles.rejectedReasonBox}>
                <Text style={styles.rejectedReasonText}>
                  {getPhotoQualityIssueMessage(qualityCheck.issue)}
                </Text>
              </View>
            )}
          </View>
        )}

        {cameraError && (
          <Text style={styles.errorText} accessibilityLiveRegion="polite">
            {cameraError}
          </Text>
        )}

        {/* Synthesized Visual Guidance inside the Card */}
        <View id="synthesized-garment-guidance" style={styles.guidanceSection}>
          <View style={styles.guidanceHeader}>
            <Text style={styles.guidanceLabel}>
              RECOMENDACIONES PARA TU FOTO:
            </Text>
            <TouchableOpacity
              onPress={() => setIsGuideModalOpen(true)}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.guidanceDetailsLink}>Ver más detalles</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.guidanceGrid}>
            {/* Así sí */}
            <View style={styles.guidanceCard}>
              <View style={styles.guidanceImageWrapper}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop' }}
                  accessibilityLabel="Así sí"
                  style={styles.guidanceImage}
                  resizeMode="cover"
                />
                <View style={styles.yesBadge}>
                  <Check size={10} color="#FFFFFF" strokeWidth={3} />
                  <Text style={styles.badgeLabel}>Así sí</Text>
                </View>
              </View>
              <Text style={styles.guidanceCardTitle}>En percha o estirada</Text>
              <Text style={styles.guidanceCardSubtitle}>Luz suave y sin tu sombra</Text>
            </View>

            {/* Así no */}
            <View style={styles.guidanceCard}>
              <View style={styles.guidanceImageWrapper}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?q=80&w=600&auto=format&fit=crop' }}
                  accessibilityLabel="Así no"
                  style={styles.guidanceImage}
                  resizeMode="cover"
                />
                <View style={styles.noBadge}>
                  <X size={10} color="#FFFFFF" strokeWidth={3} />
                  <Text style={styles.badgeLabel}>Así no</Text>
                </View>
              </View>
              <Text style={styles.guidanceCardTitle}>Arrugada o doblada</Text>
              <Text style={styles.guidanceCardSubtitle}>En desorden o bordes cortados</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Continue CTA */}
      <View style={styles.footerCTA}>
        <TouchableOpacity
          id="btn-continue-to-reference"
          onPress={onContinue}
          disabled={!selectedGarment || !canContinue}
          activeOpacity={0.88}
          style={[
            styles.continueButton,
            selectedGarment && canContinue ? styles.continueButtonEnabled : styles.continueButtonDisabled,
          ]}
        >
          <Text
            style={[
              styles.continueButtonText,
              selectedGarment && canContinue ? styles.continueTextEnabled : styles.continueTextDisabled,
            ]}
          >
            Continuar a mi foto
          </Text>
          {selectedGarment && canContinue && <Sparkles size={16} color="#FAF7F2" />}
        </TouchableOpacity>
      </View>

      {/* Photo Guide Modal for Garments */}
      <GarmentPhotoGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        onTakePhoto={handleTakePhoto}
        onUploadGallery={handleUploadGallery}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    width: '100%',
    flex: 1,
  },
  container: {
    width: '100%',
    maxWidth: 448,
    marginHorizontal: 'auto',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    flexDirection: 'column',
    flexGrow: 1,
  },
  indicatorContainer: {
    marginBottom: 16,
  },
  indicatorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: '#ECE4DA',
    borderWidth: 1,
    borderColor: 'rgba(220, 210, 196, 0.6)',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#7A4655',
  },
  indicatorText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2B2420',
  },
  progressBarTrack: {
    width: '100%',
    height: 4,
    backgroundColor: '#ECE4DA',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    width: '50%',
    height: '100%',
    backgroundColor: '#7A4655',
    borderRadius: 2,
  },
  headerBlock: {
    marginBottom: 16,
  },
  headline: {
    fontFamily: 'sans-serif',
    fontSize: 21,
    fontWeight: '700',
    color: '#2B2420',
    letterSpacing: -0.3,
    lineHeight: 26,
  },
  description: {
    fontSize: 14,
    color: '#75695E',
    marginTop: 6,
    lineHeight: 20,
  },
  captureCard: {
    backgroundColor: '#ECE4DA',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  cameraIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FAF7F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '500',
    color: '#2B2420',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#75695E',
    marginTop: 4,
    marginBottom: 8,
    textAlign: 'center',
    maxWidth: 290,
    lineHeight: 18,
  },
  actionButtonsStack: {
    width: '100%',
    gap: 10,
  },
  primaryActionButton: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#7A4655',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  secondaryActionButton: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#FAF7F2',
    borderWidth: 1,
    borderColor: '#DCD2C4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryActionText: {
    color: '#2B2420',
    fontWeight: '600',
    fontSize: 14,
  },
  errorText: {
    fontSize: 12,
    color: '#A85A46',
    backgroundColor: '#FAF7F2',
    padding: 8,
    borderRadius: 8,
    marginTop: 12,
    textAlign: 'center',
    width: '100%',
  },
  guidanceSection: {
    width: '100%',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(220, 210, 196, 0.7)',
  },
  guidanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  guidanceLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#75695E',
    letterSpacing: 0.8,
  },
  guidanceDetailsLink: {
    fontSize: 11,
    fontWeight: '600',
    color: '#7A4655',
    textDecorationLine: 'underline',
  },
  guidanceGrid: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  guidanceCard: {
    flex: 1,
    backgroundColor: '#FAF7F2',
    borderRadius: 14,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(220, 210, 196, 0.6)',
  },
  guidanceImageWrapper: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 6,
    backgroundColor: '#ECE4DA',
    position: 'relative',
  },
  guidanceImage: {
    width: '100%',
    height: '100%',
  },
  yesBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    backgroundColor: '#8C9B7E',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  noBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    backgroundColor: '#A85A46',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeLabel: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  guidanceCardTitle: {
    fontSize: 11,
    color: '#2B2420',
    fontWeight: '600',
    lineHeight: 14,
  },
  guidanceCardSubtitle: {
    fontSize: 9.5,
    color: '#75695E',
    marginTop: 2,
    lineHeight: 12,
  },
  uploadedFeedbackBox: {
    marginTop: 14,
    width: '100%',
    backgroundColor: '#FAF7F2',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(140, 155, 126, 0.7)',
  },
  uploadedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  uploadedThumb: {
    width: 48,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DCD2C4',
  },
  uploadedMeta: {
    flex: 1,
  },
  detectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8C9B7E',
  },
  detectedText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#8C9B7E',
    letterSpacing: 0.6,
  },
  checkingText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#75695E',
  },
  issueText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#A85A46',
    letterSpacing: 0.6,
  },
  uploadedName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2B2420',
  },
  uploadedDesc: {
    fontSize: 11,
    color: '#75695E',
    marginTop: 2,
  },
  uploadedActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconActionButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCD2C4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectedReasonBox: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(220, 210, 196, 0.4)',
  },
  rejectedReasonText: {
    fontSize: 11.5,
    color: '#A85A46',
    lineHeight: 16,
  },
  footerCTA: {
    marginTop: 'auto',
    paddingTop: 8,
  },
  continueButton: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  continueButtonEnabled: {
    backgroundColor: '#7A4655',
  },
  continueButtonDisabled: {
    backgroundColor: '#DCD2C4',
  },
  continueButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  continueTextEnabled: {
    color: '#FFFFFF',
  },
  continueTextDisabled: {
    color: 'rgba(117, 105, 94, 0.8)',
  },
});
