import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from './components/Header';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Step1Garment } from './components/Step1Garment';
import { Step2Reference } from './components/Step2Reference';
import { ProcessingModal } from './components/ProcessingModal';
import { Step3Result } from './components/Step3Result';
import { GuestWardrobePreview } from './components/GuestWardrobePreview';
import { SignUpModal } from './components/SignUpModal';
import { OnboardingStep, Garment, ReferencePhoto, VtonResult } from './types';
import {
  SAMPLE_GARMENTS,
  DEMO_REFERENCE_PHOTO,
  SAMPLE_VTON_RESULTS,
} from './data/samples';

export default function App() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [selectedGarment, setSelectedGarment] = useState<Garment | null>(SAMPLE_GARMENTS[0]);
  const [referencePhoto, setReferencePhoto] = useState<ReferencePhoto | null>(DEMO_REFERENCE_PHOTO);
  const [activeResult, setActiveResult] = useState<VtonResult>(SAMPLE_VTON_RESULTS['blazer-arena']);
  const [isRegisteredUser, setIsRegisteredUser] = useState(false);
  const [userAuthMethod, setUserAuthMethod] = useState<'Apple' | 'Google' | 'Email' | null>(null);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastVariant, setToastVariant] = useState<'default' | 'error'>('default');

  const showToast = (msg: string, variant: 'default' | 'error' = 'default') => {
    setToastVariant(variant);
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), variant === 'error' ? 4500 : 3000);
  };

  const handleBack = () => {
    if (currentStep === 'step1_garment') {
      setCurrentStep('welcome');
    } else if (currentStep === 'step2_reference') {
      setCurrentStep('step1_garment');
    } else if (currentStep === 'step3_result') {
      setCurrentStep('step2_reference');
    } else if (currentStep === 'guest_wardrobe') {
      setCurrentStep('step3_result');
    }
  };

  const handleReset = () => {
    setSelectedGarment(SAMPLE_GARMENTS[0]);
    setReferencePhoto(DEMO_REFERENCE_PHOTO);
    setActiveResult(SAMPLE_VTON_RESULTS['blazer-arena']);
    setCurrentStep('welcome');
    showToast('Flujo reiniciado');
  };

  const handleCustomUpload = (garment: Garment) => {
    setSelectedGarment(garment);
    showToast(`Prenda agregada: ${garment.name}`);
  };

  const handleStartGeneration = () => {
    setCurrentStep('processing');
  };

  // ProcessingModal llama esto cuando generateVirtualTryOn (el llamado real
  // al back) resuelve OK: usamos directamente el resultado que devolvió el
  // servicio (ya no el mockeado de SAMPLE_VTON_RESULTS) y avanzamos.
  const handleGenerationSuccess = (result: VtonResult) => {
    setActiveResult(result);
    setCurrentStep('step3_result');
  };

  // ProcessingModal llama esto si generateVirtualTryOn falla: mostramos el
  // mensaje real del back en el snackbar de error y volvemos al Paso 2 en
  // vez de seguir a step3_result.
  const handleGenerationError = (message: string) => {
    showToast(message, 'error');
    setCurrentStep('step2_reference');
  };

  const handleAuthSuccess = (provider: 'Apple' | 'Google' | 'Email') => {
    setIsRegisteredUser(true);
    setUserAuthMethod(provider);
    showToast(`¡Bienvenida! Cuenta vinculada con ${provider}`);
    setCurrentStep('guest_wardrobe');
  };

  const getHeaderSubtitle = () => {
    switch (currentStep) {
      case 'welcome':
        return undefined;
      case 'step1_garment':
        return undefined;
      case 'step2_reference':
        return undefined;
      case 'step3_result':
        return 'TU LOOK GENERADO';
      case 'guest_wardrobe':
        return 'PLACARD DIGITAL';
      default:
        return undefined;
    }
  };

  return (
    <SafeAreaView style={styles.outerContainer} edges={['top', 'bottom']}>
      {/* Phone container wrapper for responsive mobile presentation */}
      <View style={styles.phoneContainer}>
        {/* Header */}
        <Header
          currentStep={currentStep}
          onBack={handleBack}
          onReset={handleReset}
          subtitle={getHeaderSubtitle()}
          showAvatar={currentStep !== 'welcome' && currentStep !== 'step1_garment'}
        />

        {/* Step Views */}
        <View style={styles.mainContent}>
          {currentStep === 'welcome' && (
            <WelcomeScreen
              onStart={() => setCurrentStep('step1_garment')}
            />
          )}

          {currentStep === 'step1_garment' && (
            <Step1Garment
              selectedGarment={selectedGarment}
              onSelectGarment={(garment) => setSelectedGarment(garment)}
              onContinue={() => setCurrentStep('step2_reference')}
              onCustomUpload={handleCustomUpload}
            />
          )}

          {currentStep === 'step2_reference' && selectedGarment && (
            <Step2Reference
              selectedGarment={selectedGarment}
              referencePhoto={referencePhoto}
              onSelectReferencePhoto={(photo) => setReferencePhoto(photo)}
              onGenerate={handleStartGeneration}
            />
          )}

          {currentStep === 'step3_result' && (
            <Step3Result
              result={activeResult}
              onExploreGuest={() => setCurrentStep('guest_wardrobe')}
              onAuthSuccess={handleAuthSuccess}
            />
          )}

          {currentStep === 'guest_wardrobe' && (
            <GuestWardrobePreview
              initialResult={activeResult}
              isRegisteredUser={isRegisteredUser}
              userAuthMethod={userAuthMethod}
              onNewVton={() => setCurrentStep('step1_garment')}
              onSignUpModal={() => setIsSignUpModalOpen(true)}
            />
          )}
        </View>

        {/* Processing Modal during generation: dispara y espera el llamado
            real a generateVirtualTryOn (ver ProcessingModal.tsx) */}
        {currentStep === 'processing' && selectedGarment && referencePhoto && (
          <ProcessingModal
            garment={selectedGarment}
            referencePhoto={referencePhoto}
            onSuccess={handleGenerationSuccess}
            onError={handleGenerationError}
          />
        )}

        {/* Authentication Modal */}
        <SignUpModal
          isOpen={isSignUpModalOpen}
          onClose={() => setIsSignUpModalOpen(false)}
          onSuccess={handleAuthSuccess}
        />

        {/* Toast notifications */}
        {toastMessage && (
          <View
            style={[styles.toast, toastVariant === 'error' && styles.toastError]}
            accessibilityRole="alert"
            accessibilityLiveRegion="assertive"
          >
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#F6F1EA',
    alignItems: 'center',
    width: '100%',
  },
  phoneContainer: {
    width: '100%',
    maxWidth: 448,
    flex: 1,
    backgroundColor: '#F6F1EA',
    flexDirection: 'column',
    position: 'relative',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(220, 210, 196, 0.3)',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'column',
  },
  toast: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    maxWidth: 408,
    marginHorizontal: 'auto',
    zIndex: 50,
    backgroundColor: '#2B2420',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },
  toastError: {
    backgroundColor: '#A85A46',
  },
  toastText: {
    color: '#F6F1EA',
    fontSize: 12.5,
    fontWeight: '500',
    textAlign: 'center',
  },
});

