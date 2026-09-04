import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Sparkles, FastForward } from 'lucide-react';
import { Garment } from '../types';

interface ProcessingModalProps {
  garment: Garment;
  onComplete: () => void;
}

export const ProcessingModal: React.FC<ProcessingModalProps> = ({
  garment,
  onComplete,
}) => {
  const [progress, setProgress] = useState(12);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = [
    'Segmentando silueta y recortando fondo...',
    `Conservando texturas y caída de ${garment.name}...`,
    'Mapeando volumen corporal y drapeado textil...',
    'Aplicando luz natural y acabado editorial...',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete(), 400);
          return 100;
        }
        const increment = prev < 60 ? 12 : prev < 85 ? 8 : 5;
        const next = Math.min(prev + increment, 100);

        if (next > 75) setCurrentStepIndex(3);
        else if (next > 50) setCurrentStepIndex(2);
        else if (next > 25) setCurrentStepIndex(1);

        return next;
      });
    }, 450);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <View style={styles.overlay}>
      <View style={styles.contentBox}>
        {/* Brand Loader: Animated Textile Hanger Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.hangerWrapper}>
            <svg
              width="72"
              height="72"
              viewBox="0 0 64 64"
              fill="none"
              stroke="#7A4655"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Hook */}
              <path d="M32 14c0-4.418 3.582-8 8-8s8 3.582 8 8c0 3.5-2.2 6.5-5.5 7.5L32 24" />
              {/* Triangle hanger frame */}
              <path d="M32 24L8 42h48L32 24z" />
              {/* Horizontal bottom bar */}
              <line x1="8" y1="42" x2="56" y2="42" />
              {/* Lower garment bar notch */}
              <line x1="20" y1="46" x2="44" y2="46" strokeWidth="1.5" strokeOpacity="0.5" />
            </svg>
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

        <Text style={styles.description}>
          {steps[currentStepIndex]}
        </Text>

        {/* Linear progress */}
        <View style={styles.progressBarTrack}>
          <View
            style={[styles.progressBarFill, { width: `${progress}%` }]}
          />
        </View>

        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>Calce orgánico</Text>
          <Text style={styles.progressValue}>{progress}%</Text>
        </View>

        {/* Skip button */}
        <TouchableOpacity
          onPress={onComplete}
          activeOpacity={0.7}
          style={styles.skipButton}
        >
          <FastForward size={14} color="#75695E" />
          <Text style={styles.skipText}>Acelerar resultado</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'fixed' as any,
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
    fontFamily: 'serif',
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
  skipButton: {
    marginTop: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  skipText: {
    fontSize: 12,
    color: '#75695E',
    textDecorationLine: 'underline',
  },
});

