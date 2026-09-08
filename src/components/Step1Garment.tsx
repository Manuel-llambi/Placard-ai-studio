import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
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
} from 'lucide-react';
import { Garment } from '../types';
import { GarmentPhotoGuideModal } from './GarmentPhotoGuideModal';
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isLiveCameraActive, setIsLiveCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const customGarment: Garment = {
          id: `custom-garment-${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, '').slice(0, 24) || 'Mi prenda fotografiada',
          category: 'Prenda propia',
          imageUrl: event.target?.result as string,
          colorName: 'Tonalidad natural',
          colorHex: '#7A4655',
          material: 'Tejido real',
          description: 'Foto tomada por el usuario con recorte automático por IA.',
          isCustomUpload: true,
        };
        // Atajo de prueba: si el nombre del archivo incluye "error", forzamos el
        // rechazo para poder ver el estado de calidad insuficiente sin depender del azar.
        const forceIssue: PhotoQualityIssue | undefined = /error/i.test(file.name)
          ? 'muy_oscura'
          : undefined;
        runQualityCheck(customGarment, forceIssue);
      };
      reader.readAsDataURL(file);
    }
  };

  const startLiveCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 720 }, height: { ideal: 960 } },
      });
      setIsLiveCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.warn('Camera access denied or unavailable, falling back to input', err);
      setCameraError('No pudimos acceder a la cámara. Elegí una foto de tu galería o revisá los permisos.');
      cameraInputRef.current?.click();
    }
  };

  const stopLiveCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsLiveCameraActive(false);
  };

  const captureLiveSnapshot = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 720;
      canvas.height = video.videoHeight || 960;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        const customGarment: Garment = {
          id: `custom-garment-${Date.now()}`,
          name: 'Foto de prenda propia',
          category: 'Prenda propia',
          imageUrl: dataUrl,
          colorName: 'Tonalidad natural',
          colorHex: '#7A4655',
          material: 'Tejido real',
          description: 'Foto tomada en vivo con guía de alineación.',
          isCustomUpload: true,
        };
        stopLiveCamera();
        runQualityCheck(customGarment);
      }
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
    <View style={styles.container}>
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

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
        <Text style={styles.headline} accessibilityRole="header">
          Primero, una prenda que ames
        </Text>
        <Text style={styles.description}>
          Sacale una foto a una prenda tuya para ver cómo te queda puesta en tu silueta.
        </Text>
      </View>

      {/* Capture Card */}
      <View id="garment-capture-card" style={styles.captureCard}>
        {isLiveCameraActive ? (
          /* Live Camera Viewfinder inside card */
          <View style={styles.cameraContainer}>
            <View style={styles.videoWrapper}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                aria-label="Vista previa de la cámara en vivo"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Garment / Hanger Dashed Alignment Guide */}
              <View style={styles.cameraOverlayGuide}>
                <svg
                  width="160"
                  height="160"
                  viewBox="0 0 100 100"
                  fill="none"
                  stroke="rgba(255,255,255,0.7)"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                  aria-hidden="true"
                >
                  <path d="M50 20c-5-7-2-12 4-12 5 0 6 4 2 8l-6 4" />
                  <path d="M15 45L50 20l35 25H15z" />
                  <path d="M22 45l-8 16 10 4 6-12v40h40V53l6 12 10-4-8-16" />
                </svg>

                <View style={styles.cameraTipBadge}>
                  <Text style={styles.cameraTipText}>Encuadrala completa y estirada</Text>
                </View>
              </View>

              {/* Close Live Camera */}
              <TouchableOpacity
                onPress={stopLiveCamera}
                activeOpacity={0.7}
                style={styles.closeCameraButton}
                accessibilityLabel="Cerrar cámara"
                accessibilityRole="button"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <X size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Shutter Button */}
            <View style={styles.cameraButtonsRow}>
              <TouchableOpacity
                onPress={stopLiveCamera}
                activeOpacity={0.8}
                style={styles.cancelCameraButton}
                accessibilityRole="button"
                accessibilityLabel="Cancelar y cerrar cámara"
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                <Text style={styles.cancelCameraText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={captureLiveSnapshot}
                activeOpacity={0.85}
                style={styles.shutterButton}
                accessibilityLabel="Capturar foto de la prenda"
                accessibilityRole="button"
              >
                <Camera size={16} color="#FFFFFF" />
                <Text style={styles.shutterButtonText}>Capturar foto</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* Standard Card View */
          <>
            <View style={styles.cameraIconCircle}>
              <Camera size={24} color="#7A4655" strokeWidth={1.8} />
            </View>

            <Text style={styles.cardTitle}>
              Capturá tu prenda propia
            </Text>
            <Text style={styles.cardSubtitle}>
              Nuestra IA recortará el fondo automáticamente conservando texturas y caída.
            </Text>

            {/* Direct Trigger to Open Guide Modal */}
            <TouchableOpacity
              id="btn-open-garment-tips"
              onPress={() => setIsGuideModalOpen(true)}
              activeOpacity={0.7}
              style={styles.guideTriggerButton}
              accessibilityRole="button"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Sparkles size={14} color="#7A4655" />
              <Text style={styles.guideTriggerText}>¿Cómo sacar una buena foto? Ver indicaciones</Text>
            </TouchableOpacity>

            {/* Main Action Buttons */}
            <View style={styles.actionButtonsStack}>
              <TouchableOpacity
                id="btn-take-photo-garment"
                onPress={startLiveCamera}
                activeOpacity={0.85}
                style={styles.primaryActionButton}
                accessibilityRole="button"
              >
                <Camera size={16} color="#FFFFFF" />
                <Text style={styles.primaryActionText}>Tomar foto a una prenda</Text>
              </TouchableOpacity>

              <TouchableOpacity
                id="btn-upload-gallery-garment"
                onPress={() => fileInputRef.current?.click()}
                activeOpacity={0.85}
                style={styles.secondaryActionButton}
                accessibilityRole="button"
              >
                <ImageIcon size={16} color="#706459" />
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
                        <View style={styles.issueDot} />
                        <Text style={styles.issueText}>Detectamos un problema con la foto</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.uploadedActions}>
                    <TouchableOpacity
                      onPress={() => cameraInputRef.current?.click()}
                      activeOpacity={0.7}
                      accessibilityRole="button"
                      accessibilityLabel="Reintentar foto de la prenda"
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      style={styles.iconActionButton}
                    >
                      <RotateCcw size={16} color="#706459" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleDeleteCapturedGarment}
                      activeOpacity={0.7}
                      accessibilityRole="button"
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
                  accessibilityRole="button"
                  accessibilityLabel="Ver más detalles sobre cómo fotografiar tu prenda"
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
          </>
        )}
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
          accessibilityRole="button"
          accessibilityLabel="Continuar a mi foto de referencia"
          accessibilityState={{ disabled: !selectedGarment }}
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
        onTakePhoto={() => cameraInputRef.current?.click()}
        onUploadGallery={() => fileInputRef.current?.click()}
        onStartLiveCamera={startLiveCamera}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 448,
    marginHorizontal: 'auto',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    flexDirection: 'column',
    minHeight: 'calc(100vh - 60px)' as any,
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
    fontSize: 26,
    fontWeight: '600',
    color: '#2B2420',
    letterSpacing: -0.4,
    lineHeight: 32,
  },
  description: {
    fontSize: 14,
    color: '#706459',
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
    fontWeight: '600',
    color: '#2B2420',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#706459',
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
    color: '#706459',
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
    color: '#706459',
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
    color: '#706459',
  },
  issueDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#A85A46',
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
    color: '#706459',
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
  guideLink: {
    fontSize: 11,
    color: '#7A4655',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  repeatLink: {
    fontSize: 11,
    color: '#706459',
    textDecorationLine: 'underline',
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
  cameraContainer: {
    width: '100%',
    alignItems: 'center',
  },
  videoWrapper: {
    position: 'relative',
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000000',
    marginBottom: 12,
  },
  cameraOverlayGuide: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  cameraTipBadge: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  cameraTipText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '500',
  },
  closeCameraButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  cancelCameraButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#FAF7F2',
    borderWidth: 1,
    borderColor: '#DCD2C4',
  },
  cancelCameraText: {
    color: '#706459',
    fontSize: 13,
    fontWeight: '500',
  },
  shutterButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#7A4655',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  shutterButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
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


