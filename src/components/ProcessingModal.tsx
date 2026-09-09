import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Line } from 'react-native-svg';
import { Sparkles } from 'lucide-react-native';
import { Garment, ReferencePhoto, VtonResult } from '../types';
import { generateVirtualTryOn } from '../services/virtualTryOnService';

interface ProcessingModalProps {
  garment: Garment;
  referencePhoto: ReferencePhoto;
  onSuccess: (result: VtonResult) => void;
  onError: (message: string) => void;
}

// Techo del progreso "visual" mientras esperamos la respuesta real del back.
// Nunca llega a 100% por su cuenta: eso solo pasa cuando generateVirtualTryOn
// efectivamente resuelve, así esta pantalla no miente sobre cuánto falta.
const PROGRESS_CEILING = 90;

export const ProcessingModal: React.FC<ProcessingModalProps> = ({
  garment,
  referencePhoto,
  onSuccess,
  onError,
}) => {
  const [progress, setProgress] = useState(12);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = [
    'Segmentando silueta y recortando fondo...',
    `Conservando texturas y caída de ${garment.name}...`,
    'Mapeando volumen corporal y drapeado textil...',
    'Aplicando luz natural y acabado editorial...',
  ];

  // Esta pantalla representa el loading real del llamado al back: dispara
  // generateVirtualTryOn al montar y solo avanza de paso cuando esa promesa
  // resuelve. Si falla, corta acá y le pasa el mensaje de error a App.tsx
  // (que lo muestra en el snackbar y vuelve al Paso 2); no hay forma de
  // "saltear" un llamado real, así que no hay botón de skip.
  useEffect(() => {
    let cancelled = false;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= PROGRESS_CEILING) return prev;
        const increment = prev < 60 ? 12 : 8;
        const next = Math.min(prev + increment, PROGRESS_CEILING);

        if (next > 75) setCurrentStepIndex(3);
        else if (next > 50) setCurrentStepIndex(2);
        else if (next > 25) setCurrentStepIndex(1);

        return next;
      });
    }, 450);

    generateVirtualTryOn({ garmentPhoto: garment, referencePhoto })
      .then((result) => {
        if (cancelled) return;
        clearInterval(interval);
        setCurrentStepIndex(3);
        setProgress(100);
        setTimeout(() => {
          if (!cancelled) onSuccess(result);
        }, 400);
      })
      .catch((error) => {
        if (cancelled) return;
        clearInterval(interval);
        onError(
          error instanceof Error
            ? error.message
            : 'No pudimos generar tu look. Probá de nuevo en unos segundos.'
        );
      });

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [garment, referencePhoto]);

  return (
    <View style={styles.overlay}>
      <View style={styles.contentBox}>
        {/* Brand Loader: Animated Textile Hanger Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.hangerWrapper}>
            <Svg
              width={72}
              height={72}
              viewBox="0 0 64 64"
              fill="none"
              stroke="#7A4655"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Hook */}
              <Path d="M32 14c0-4.418 3.582-8 8-8s8 3.582 8 8c0 3.5-2.2 6.5-5.5 7.5L32 24" />
              {/* Triangle hanger frame */}
              <Path d="M32 24L8 42h48L32 24z" />
              {/* Horizontal bottom bar */}
              <Line x1={8} y1={42} x2={56} y2={42} />
              {/* Lower garment bar notch */}
              <Line x1={20} y1={46} x2={44} y2={46} strokeWidth={1.5} strokeOpacity={0.5} />
            </Svg>
          </View>
          <View style={styles.shadowPill} />
        </View>

        {/* Status text */}
        <View style={styles.badgePill}>
          <Sparkles size={14} color="#7A4655" />
          <Text style={styles.badgeText}>VTON ENGINE</Text>
        </View>

        <Text style={styles.title}>
          Creando tu primer look
        </Text>

        <Text style={styles.description} accessibilityLiveRegion="polite">
          {steps[currentStepIndex]}
        </Text>

        {/* Linear progress */}
        <View
          style={styles.progressBarTrack}
          accessibilityRole="progressbar"
          accessibilityValue={{ min: 0, max: 100, now: progress }}
          accessibilityLabel="Progreso de generación del look"
        >
          <View
            style={[styles.progressBarFill, { width: `${progress}%` }]}
          />
        </View>

        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>Calce orgánico</Text>
          <Text style={styles.progressValue}>{progress}%</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    backgroundColor: 'rgba(246, 241, 234, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  contentBox: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  iconContainer: {
    width: 96,
    height: 96,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hangerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadowPill: {
    position: 'absolute',
    bottom: -4,
    width: 48,
    height: 4,
    backgroundColor: 'rgba(43, 36, 32, 0.1)',
    borderRadius: 2,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: '#ECE4DA',
    marginBottom: 12,
  },
  badgeText: {
    color: '#7A4655',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  title: {
    fontFamily: 'sans-serif',
    fontSize: 22,
    fontWeight: '500',
    color: '#2B2420',
    textAlign: 'center',
    letterSpacing: -0.3,
    lineHeight: 28,
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    color: '#75695E',
    textAlign: 'center',
    minHeight: 40,
    paddingHorizontal: 8,
    lineHeight: 19,
  },
  progressBarTrack: {
    width: '100%',
    backgroundColor: '#ECE4DA',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 24,
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#7A4655',
    borderRadius: 4,
  },
  progressRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#75695E',
  },
  progressValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2B2420',
  },
});

