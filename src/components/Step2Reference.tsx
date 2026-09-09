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
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Check,
  X,
  RotateCcw,
  Trash2,
} from 'lucide-react-native';
import { Garment, ReferencePhoto } from '../types';
import { GUIDE_PHOTOS } from '../data/samples';
import { BodyPhotoGuideModal } from './BodyPhotoGuideModal';
import { generateVirtualTryOn } from '../services/virtualTryOnService';
import { pickImageFromCamera, pickImageFromGallery } from '../utils/pickImage';
import {
  PhotoQualityIssue,
  getPhotoQualityIssueMessage,
  simulatePhotoQualityCheck,
} from '../utils/simulatePhotoQuality';

type QualityStatus = 'idle' | 'checking' | 'approved' | 'rejected';

interface Step2ReferenceProps {
  selectedGarment: Garment;
  referencePhoto: ReferencePhoto | null;
  onSelectReferencePhoto: (photo: ReferencePhoto) => void;
  onGenerate: () => void;
}

export const Step2Reference: React.FC<Step2ReferenceProps> = ({
  selectedGarment,
  referencePhoto,
  onSelectReferencePhoto,
  onGenerate,
}) => {
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // Foto propia capturada/subida en ESTA pantalla, se haya aprobado o no.
  // Se mantiene visible durante un rechazo/reintento para no perder el contexto.
  const [capturedReferencePhoto, setCapturedReferencePhoto] = useState<ReferencePhoto | null>(
    () => (referencePhoto && !referencePhoto.isDemo ? referencePhoto : null)
  );
  // Qué dice el chequeo de calidad simulado sobre esa foto ahora mismo.
  const [qualityCheck, setQualityCheck] = useState<{ status: QualityStatus; issue?: PhotoQualityIssue }>(
    () => (referencePhoto && !referencePhoto.isDemo ? { status: 'approved' } : { status: 'idle' })
  );

  // Corre la validación de calidad simulada sobre una foto recién capturada/subida.
  // Solo si aprueba se eleva la foto al estado del padre (App.tsx) vía onSelectReferencePhoto;
  // si la rechaza, la foto capturada se mantiene visible localmente para poder reintentar
  // sin perderla, pero el padre sigue con lo que tenía antes.
  const runQualityCheck = async (photo: ReferencePhoto, forceIssue?: PhotoQualityIssue) => {
    setCapturedReferencePhoto(photo);
    setQualityCheck({ status: 'checking' });

    const result = await simulatePhotoQualityCheck(forceIssue);

    if (result.approved) {
      setQualityCheck({ status: 'approved' });
      onSelectReferencePhoto(photo);
    } else {
      setQualityCheck({ status: 'rejected', issue: result.issue });
    }
  };

  // Descarta la foto propia capturada en esta pantalla y vuelve a mostrar los botones
  // de captura. Solo limpia el estado local: si la foto ya había sido aprobada y elevada
  // al padre (App.tsx), la foto seleccionada ahí no cambia hasta que se suba/capture otra.
  const handleDeleteCapturedReferencePhoto = () => {
    setCapturedReferencePhoto(null);
    setQualityCheck({ status: 'idle' });
  };

  // Abre la cámara nativa del dispositivo (expo-image-picker) para sacar la foto de referencia.
  const handleTakePhoto = async () => {
    setCameraError(null);
    try {
      const picked = await pickImageFromCamera();
      if (!picked) return; // el usuario canceló

      const photo: ReferencePhoto = {
        id: `camera-snap-${Date.now()}`,
        name: 'Foto tomada en vivo',
        imageUrl: picked.uri,
        isDemo: false,
        isLive: true,
      };
      // Atajo de prueba: si el nombre del archivo incluye "error", forzamos el
      // rechazo para poder ver el estado de calidad insuficiente sin depender del azar.
      const forceIssue: PhotoQualityIssue | undefined = /error/i.test(picked.fileName)
        ? 'muy_oscura'
        : undefined;
      runQualityCheck(photo, forceIssue);
    } catch (err) {
      console.warn('No se pudo abrir la cámara', err);
      setCameraError(
        err instanceof Error ? err.message : 'No pudimos acceder a la cámara. Revisá los permisos.'
      );
    }
  };

  // Abre la galería nativa del dispositivo (expo-image-picker) para elegir la foto de referencia.
  const handleUploadGallery = async () => {
    setCameraError(null);
    try {
      const picked = await pickImageFromGallery();
      if (!picked) return; // el usuario canceló

      const customPhoto: ReferencePhoto = {
        id: `ref-${Date.now()}`,
        name: picked.fileName,
        imageUrl: picked.uri,
        isDemo: false,
      };
      const forceIssue: PhotoQualityIssue | undefined = /error/i.test(picked.fileName)
        ? 'muy_oscura'
        : undefined;
      runQualityCheck(customPhoto, forceIssue);
    } catch (err) {
      console.warn('No se pudo abrir la galería', err);
      setCameraError(
        err instanceof Error ? err.message : 'No pudimos acceder a tu galería. Revisá los permisos.'
      );
    }
  };

  // Si no se tocó "tomar foto"/"subir de galería" en esta pantalla, no bloqueamos nada
  // (deja intacto el click-through de demo con la foto de Camila precargada).
  // Apenas hay una foto propia en juego, hay que esperar a que quede aprobada.
  const canContinue = !capturedReferencePhoto || qualityCheck.status === 'approved';

  // Dispara la generación del VTON contra el backend real (aún no implementado,
  // ver src/services/virtualTryOnService.ts) y, en paralelo, sigue con el flujo
  // mockeado actual (onGenerate) para no romper la demo mientras no haya endpoint.
  const handleGeneratePress = () => {
    if (!referencePhoto) return;

    generateVirtualTryOn({
      garmentPhoto: selectedGarment,
      referencePhoto,
    }).catch((error) => {
      console.warn('[virtualTryOnService] generateVirtualTryOn no implementada todavía:', error);
    });

    onGenerate();
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Step Indicator & Progress */}
      <View style={styles.indicatorContainer}>
        <View style={styles.indicatorRow}>
          <Text style={styles.indicatorLabel}>Paso 2 de 2 • Tu cuerpo</Text>
          <Text style={styles.indicatorPercent}>100%</Text>
        </View>
        <View style={styles.progressBarTrack}>
          <View style={styles.progressBarFill} />
        </View>
      </View>

      {/* Garment Ready Status Banner */}
      <View style={styles.statusBanner}>
        <View style={styles.statusInfoRow}>
          <Image
            source={{ uri: selectedGarment.imageUrl }}
            accessibilityLabel={selectedGarment.name}
            style={styles.garmentThumb}
            resizeMode="cover"
          />
          <View style={styles.statusMeta}>
            <Text style={styles.garmentStatusLabel}>
              Prenda lista
            </Text>
            <Text style={styles.garmentName} numberOfLines={1}>
              {selectedGarment.name}
            </Text>
          </View>
        </View>
        <View style={styles.checkCircleBadge}>
          <CheckCircle2 size={16} color="#8C9B7E" />
        </View>
      </View>

      {/* Headline & Description */}
      <View style={styles.headerBlock}>
        <Text style={styles.headline}>
          Ahora, tu foto de referencia
        </Text>
        <Text style={styles.description}>
          Una foto de cuerpo entero para adaptar la prenda a tu silueta real. Podés tomarte una foto ahora o subir una de tu galería.
        </Text>
      </View>

      {/* Interactive Body Capture & Upload Card */}
      <View id="body-capture-card" style={styles.captureCard}>
        <View style={styles.cameraIconCircle}>
          <Camera size={24} color="#7A4655" strokeWidth={1.8} />
        </View>

        <Text style={styles.cardTitle}>
          Capturá tu foto de cuerpo
        </Text>
        <Text style={styles.cardSubtitle}>
          Nuestra IA adaptará la prenda a tu silueta real, respetando tus proporciones.
        </Text>

        {/* Explicit Privacy Banner (Rule 7: direct & reassuring) */}
        <View style={styles.privacyBanner}>
          <View style={styles.shieldIconWrapper}>
            <ShieldCheck size={14} color="#4F6844" />
          </View>
          <Text style={styles.privacyText}>
            Esta foto la usamos solo para mostrarte cómo te queda esta prenda. Se borra sola a las 72 horas y nunca se usa para entrenar inteligencia artificial.
          </Text>
        </View>

        {/* Main Action Buttons */}
        <View style={styles.actionButtonsStack}>
          <TouchableOpacity
            id="btn-take-photo-body"
            onPress={handleTakePhoto}
            activeOpacity={0.85}
            style={styles.primaryActionButton}
          >
            <Camera size={16} color="#FFFFFF" />
            <Text style={styles.primaryActionText}>Tomar foto a mi cuerpo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            id="btn-upload-gallery-body"
            onPress={handleUploadGallery}
            activeOpacity={0.85}
            style={styles.secondaryActionButton}
          >
            <ImageIcon size={16} color="#75695E" />
            <Text style={styles.secondaryActionText}>Subir de mi galería</Text>
          </TouchableOpacity>
        </View>

        {/* Uploaded / Selected Custom Reference Photo Feedback */}
        {capturedReferencePhoto && (
          <View style={styles.uploadedFeedbackBox}>
            <View style={styles.uploadedRow}>
              <Image
                source={{ uri: capturedReferencePhoto.imageUrl }}
                accessibilityLabel="Foto de referencia personalizada"
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
                      <Text style={styles.detectedText}>Foto propia capturada ✓</Text>
                    </View>
                    <Text style={styles.uploadedName} numberOfLines={1}>
                      {capturedReferencePhoto.name}
                    </Text>
                    <Text style={styles.uploadedDesc}>
                      Lista para adaptar la prenda a tu silueta
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
                  accessibilityLabel="Reintentar foto de referencia"
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={styles.iconActionButton}
                >
                  <RotateCcw size={16} color="#75695E" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleDeleteCapturedReferencePhoto}
                  activeOpacity={0.7}
                  accessibilityLabel="Eliminar foto de referencia"
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

        {/* Synthesized Visual Guidance inside the Card */}
        <View id="synthesized-body-guidance" style={styles.guidanceSection}>
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
                  source={GUIDE_PHOTOS.asiSi.source}
                  accessibilityLabel="Así sí"
                  style={styles.guidanceImage}
                  resizeMode="cover"
                />
                <View style={styles.yesBadge}>
                  <Check size={10} color="#FFFFFF" strokeWidth={3} />
                  <Text style={styles.badgeLabel}>Así sí</Text>
                </View>
              </View>
              <Text style={styles.guidanceCardTitle}>De frente y cuerpo entero</Text>
              <Text style={styles.guidanceCardSubtitle}>Luz suave y ropa al cuerpo</Text>
            </View>

            {/* Así no */}
            <View style={styles.guidanceCard}>
              <View style={styles.guidanceImageWrapper}>
                <Image
                  source={GUIDE_PHOTOS.asiNo.source}
                  accessibilityLabel="Así no"
                  style={styles.guidanceImage}
                  resizeMode="cover"
                />
                <View style={styles.noBadge}>
                  <X size={10} color="#FFFFFF" strokeWidth={3} />
                  <Text style={styles.badgeLabel}>Así no</Text>
                </View>
              </View>
              <Text style={styles.guidanceCardTitle}>En espejo o cortada</Text>
              <Text style={styles.guidanceCardSubtitle}>Celular tapando o contraluz</Text>
            </View>
          </View>
        </View>
      </View>

      {cameraError && (
        <Text style={styles.errorText} accessibilityLiveRegion="polite">
          {cameraError}
        </Text>
      )}

      {/* Primary CTA: Ver cómo te queda */}
      <View style={styles.footerCTA}>
        <TouchableOpacity
          id="btn-generate-vton"
          onPress={handleGeneratePress}
          disabled={!referencePhoto || !canContinue}
          activeOpacity={0.88}
          style={[
            styles.generateButton,
            (!referencePhoto || !canContinue) && styles.generateButtonDisabled,
          ]}
          accessibilityRole="button"
          accessibilityState={{ disabled: !referencePhoto || !canContinue }}
        >
          <Sparkles size={16} color={referencePhoto && canContinue ? '#FAF7F2' : '#75695E'} />
          <Text
            style={[
              styles.generateButtonText,
              (!referencePhoto || !canContinue) && styles.generateButtonTextDisabled,
            ]}
          >
            Ver cómo te queda
          </Text>
        </TouchableOpacity>
      </View>

      {/* Body Photo Guide Modal */}
      <BodyPhotoGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
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
    paddingTop: 8,
    paddingBottom: 32,
    flexDirection: 'column',
    flexGrow: 1,
  },
  indicatorContainer: {
    marginBottom: 12,
  },
  indicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  indicatorLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#75695E',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  indicatorPercent: {
    fontSize: 11,
    fontWeight: '600',
    color: '#7A4655',
  },
  progressBarTrack: {
    width: '100%',
    height: 4,
    backgroundColor: '#ECE4DA',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    width: '100%',
    height: '100%',
    backgroundColor: '#7A4655',
    borderRadius: 2,
  },
  statusBanner: {
    backgroundColor: '#FAF7F2',
    borderWidth: 1,
    borderColor: 'rgba(220, 210, 196, 0.7)',
    borderRadius: 14,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statusInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  garmentThumb: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DCD2C4',
  },
  statusMeta: {
    flex: 1,
  },
  garmentStatusLabel: {
    fontSize: 11,
    color: '#75695E',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  garmentName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2B2420',
  },
  checkCircleBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(140, 155, 126, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBlock: {
    marginBottom: 16,
  },
  headline: {
    fontFamily: 'sans-serif',
    fontSize: 26,
    fontWeight: '600',
    color: '#2B2420',
    letterSpacing: -0.4,
    lineHeight: 32,
  },
  description: {
    fontSize: 13.5,
    color: '#75695E',
    marginTop: 4,
    lineHeight: 19,
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
    fontWeight: '600',
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
  guideTriggerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  guideTriggerText: {
    fontSize: 12,
    color: '#7A4655',
    fontWeight: '600',
    textDecorationLine: 'underline',
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
    gap: 10,
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
    marginTop: 2,
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
  errorText: {
    fontSize: 12,
    color: '#A85A46',
    backgroundColor: '#ECE4DA',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
    textAlign: 'center',
  },
  privacyBanner: {
    backgroundColor: 'rgba(211, 218, 199, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(140, 155, 126, 0.4)',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 20,
  },
  shieldIconWrapper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(140, 155, 126, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  privacyText: {
    fontSize: 12,
    color: '#2B2420',
    lineHeight: 16,
    flex: 1,
  },
  footerCTA: {
    marginTop: 'auto',
  },
  generateButton: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#7A4655',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  generateButtonDisabled: {
    backgroundColor: '#DCD2C4',
  },
  generateButtonTextDisabled: {
    color: 'rgba(117, 105, 94, 0.8)',
  },
});
