import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { OnboardingStep } from '../types';

interface HeaderProps {
  currentStep: OnboardingStep;
  onBack: () => void;
  onReset: () => void;
  subtitle?: string;
  showAvatar?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  onBack,
  onReset,
  subtitle,
}) => {
  const canGoBack = currentStep !== 'welcome';

  return (
    <View style={styles.headerContainer}>
      <View style={styles.sideSlot}>
        {canGoBack ? (
          <TouchableOpacity
            id="header-back-button"
            onPress={onBack}
            activeOpacity={0.7}
            style={styles.iconButton}
            accessibilityLabel="Volver al paso anterior"
            accessibilityRole="button"
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <ArrowLeft size={20} color="#2B2420" strokeWidth={1.75} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            id="header-reset-button"
            onPress={onReset}
            activeOpacity={0.7}
            style={styles.iconButton}
            accessibilityLabel="Reiniciar"
            accessibilityRole="button"
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <RotateCcw size={16} color="#75695E" strokeWidth={1.75} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.centerSlot}>
        <Text style={styles.title}>Placard</Text>
        {subtitle && (
          <Text style={styles.subtitle}>{subtitle}</Text>
        )}
      </View>

      <View style={[styles.sideSlot, styles.rightSlot]}>
        <View style={styles.spacer} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#F6F1EA',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(220, 210, 196, 0.4)',
    zIndex: 30,
  },
  sideSlot: {
    width: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSlot: {
    justifyContent: 'flex-end',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerSlot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'sans-serif',
    fontSize: 22,
    fontWeight: '500',
    color: '#2B2420',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    fontWeight: '600',
    color: '#75695E',
    marginTop: 2,
  },
  spacer: {
    width: 36,
    height: 36,
  },
});

